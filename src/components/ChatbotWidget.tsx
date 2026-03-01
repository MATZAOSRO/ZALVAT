import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';
import Markdown from 'react-markdown';
import { ShieldAlert, Send, Bot, Loader2, MessageSquare, X } from 'lucide-react';
import { useStats } from '../hooks/useStats';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { DrinkType } from '../types';

const addConsumoDeclaration: FunctionDeclaration = {
  name: "addConsumo",
  description: "Registra el consumo de una bebida para el usuario.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      tipo: {
        type: Type.STRING,
        description: "cerveza, vino, licor, coctel, agua, mocktail, otra",
      },
      unidades: {
        type: Type.NUMBER,
        description: "Cantidad consumida",
      }
    },
    required: ["tipo", "unidades"],
  },
};

const openUberDeclaration: FunctionDeclaration = {
  name: "openUber",
  description: "Abre la aplicación de Uber web o móvil para que el usuario pueda pedir un viaje a casa de manera rápida y segura. Úsalo SIEMPRE que el usuario indique que está borracho, tomado, no puede manejar o se siente mal.",
};

type Message = {
  role: 'user' | 'model';
  content: string;
};

export function ChatbotWidget() {
  const stats = useStats();
  const { promociones, addConsumo } = useAppContext();
  const { user, updateContactoEmergencia } = useAuth();
  const [emergencyInput, setEmergencyInput] = useState('');

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: '¡Hola! Soy la **Inteligencia Artificial** de ZALVA-T 🤖. Estoy aquí para ayudarte a registrar tus consumos, recomendarte los mejores planes y promociones, o cuidarte si te pasaste de tragos. ¿En qué te puedo ayudar hoy?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  useEffect(() => {
    if (chatRef.current) return;

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      console.error("NO SE ENCONTRÓ VITE_GEMINI_API_KEY");
      return;
    }

    // ✅ FORMA CORRECTA DE INICIALIZAR
    const ai = new GoogleGenAI({
      apiKey: apiKey
    });

    chatRef.current = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `Eres una Inteligencia Artificial avanzada y el asistente central de la app ZALVA-T, diseñada para acompañar a los usuarios y promover un consumo responsable sin moralizar. Tu tono debe ser muy inteligente, proactivo, conversacional, empático, claro y conciso en español.

COMO IA DE ZALVA-T, TIENES ESTAS CAPACIDADES CLAVE:

1. REGISTRAR BEBIDAS: Tienes la herramienta 'addConsumo'. Si el usuario menciona que está tomando algo, te pide registrar una bebida, o menciona su consumo actual, DEBES LLAMAR A ESTA HERRAMIENTA OBLIGATORIAMENTE para guardar el dato en su cuenta.
2. PROPONER PROMOCIONES Y PLANES: Conoces las promociones de ZALVA-T. Si el usuario te pregunta qué hacer, busca planes, promos, opciones para salir, o si notas que es un buen momento, RECOMIENDA activamente estas promociones y sus códigos de descuento de forma amigable y natural detallando el beneficio.
3. CUIDAR Y PROTEGER: Si el usuario indica de alguna forma que está borracho, tomado, se siente mal o no puede manejar, DEBES LLAMAR OBLIGATORIAMENTE a la función herramienta 'openUber' para abrirle el transporte y llevarlo seguro a casa. Además, en tu respuesta de texto incluye EXACTAMENTE este botón en Markdown para que llame a su contacto de emergencia:

[🚨 Llamar a Contacto de Emergencia](tel:NUMERO_EMERGENCIA)

(Sustituye "NUMERO_EMERGENCIA" por el valor de "Contacto de Emergencia" provisto en tu contexto).

Toma tus decisiones basadas en el siguiente contexto en tiempo real del usuario:
- Unidades esta semana: ${stats.weeklyUnits} (Menciona esto brevemente si registras una bebida)
- Límite semanal: ${stats.limiteSemanal}
- Bebida frecuente: ${stats.mostConsumedType}
- Contacto de Emergencia: ${user?.contacto_emergencia || 'No configurado'}
- Promociones Disponibles (ofrece estas si te piden planes o sugerencias): ${promociones.map(p => `${p.titulo} (${p.codigo})`).join(' | ')}`,
        tools: [{ functionDeclarations: [addConsumoDeclaration, openUberDeclaration] }],
      }
    });

  }, [stats, promociones, user?.contacto_emergencia]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !chatRef.current) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      let response = await chatRef.current.sendMessage({
        message: userMessage
      });

      if (response.functionCalls?.length) {
        for (const call of response.functionCalls) {
          if (call.name === 'addConsumo') {
            const args = call.args as { tipo: string; unidades: number };

            addConsumo(args.tipo as DrinkType, args.unidades);

            response = await chatRef.current.sendMessage({
              message: `El consumo fue registrado correctamente.Confirma al usuario de forma amigable.`
            });
          } else if (call.name === 'openUber') {
            window.open("https://m.uber.com/ul", "_blank");

            response = await chatRef.current.sendMessage({
              message: `La aplicación de Uber ha sido abierta.Confírmale al usuario con un mensaje amigable, recomiéndale no conducir y OBLIGATORIAMENTE añade al final de tu mensaje este enlace exacto en markdown para que pueda llamar a su familiar: \n\n[🚨 Llamar a Contacto de Emergencia](tel: ${user?.contacto_emergencia})`
            });
          }
        }
      }

      const text = response.text || 'No pude generar respuesta.';
      setMessages(prev => [...prev, { role: 'model', content: text }]);

    } catch (error) {
      console.error("Gemini error:", error);
      setMessages(prev => [
        ...prev,
        { role: 'model', content: 'Ocurrió un error. Intenta nuevamente.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 p-4 bg-brand-600 text-white rounded-full shadow-lg transition-all ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageSquare size={24} />
      </button>

      <div className={`fixed bottom-0 right-0 md:bottom-6 md:right-6 z-50 w-full h-full md:w-[400px] md:h-[600px] bg-white md:rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>

        <header className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Bot size={20} />
            <h2 className="font-bold">Asistente ZALVA-T</h2>
          </div>
          <button onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </header>

        {isOpen && !user?.contacto_emergencia ? (
          <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-6 text-center space-y-4 bg-slate-50">
            <div className="bg-brand-100 p-4 rounded-full">
              <ShieldAlert size={32} className="text-brand-600" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Seguridad Primero</h3>
            <p className="text-sm text-slate-600">
              Antes de usar el asistente, registra un número de confianza para casos de emergencia. ZALVA-T solo usará este dato para mantenerte seguro.
            </p>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (emergencyInput.trim()) {
                  await updateContactoEmergencia(emergencyInput.trim());
                }
              }}
              className="w-full space-y-3 mt-4"
            >
              <input
                type="tel"
                placeholder="Ej: +57 300 000 0000"
                value={emergencyInput}
                onChange={e => setEmergencyInput(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                required
              />
              <button type="submit" className="w-full bg-brand-600 text-white rounded-lg py-2 font-medium hover:bg-brand-700">
                Guardar Contacto
              </button>
            </form>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-white border'}`}>
                    {msg.role === 'user'
                      ? msg.content
                      : <Markdown>{msg.content}</Markdown>}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Loader2 size={16} className="animate-spin" />
                  Pensando...
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 border rounded-full px-4 py-2 text-sm"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-brand-600 text-white p-2 rounded-full"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </>
  );
}

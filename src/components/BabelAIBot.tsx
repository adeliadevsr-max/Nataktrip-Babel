import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, HelpCircle, Heart, Check, RefreshCw, Star, Info, Compass, MessageSquareCode, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { Destination, UserStatus } from '../types';
import { DESTINATIONS } from '../data';

interface BabelAIBotProps {
  userStatus: UserStatus;
  onOpenUpgrade: () => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  activeIsland: 'Bangka' | 'Belitung';
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: Date;
  suggestions?: Destination[];
}

export default function BabelAIBot({
  userStatus,
  onOpenUpgrade,
  favorites,
  onToggleFavorite,
  activeIsland
}: BabelAIBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Halo Kak! 🤖 Saya NatakAI, asisten bot travel personal Bangka Belitung Anda. Ada yang bisa saya bantu untuk merencanakan liburan impian Kakak hari ini?\n\nKakak bisa tanya rekomendasi pantai, kuliner lempah kuning, gangan, tempat sarapan pagi, atau kedai kopi pecinan tempo dulu!`,
      timestamp: new Date()
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    if (!isCollapsed) {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isCollapsed]);

  const starterQuestions = [
    { text: "Rekomendasi Pantai Granit Eksotis", key: "pantai" },
    { text: "Kuliner Lempah Kuning & Gangan terbaik", key: "gangan" },
    { text: "Kedai Kopi Saring tertua & tersohor", key: "kopi" },
    { text: "Petualangan Film Laskar Pelangi", key: "laskar" }
  ];

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const lowerText = textToSend.toLowerCase();
      let aiResponseText = '';
      let matchedSpots: Destination[] = [];

      // Keyword searching engine on DESTINATIONS list
      if (lowerText.includes('pantai') || lowerText.includes('wisata alam') || lowerText.includes('sunset') || lowerText.includes('laut')) {
        matchedSpots = DESTINATIONS.filter(item => item.category === 'Pantai' && item.island === activeIsland);
        aiResponseText = `Berikut adalah daftar pantai eksotis pilihan terbaik warga lokal di Pulau ${activeIsland}. Selai menawarkan pasir kuarsa seputih salju, pantai-pantai ini terkenal dengan tumpukan batu granit purbanya yang sangat megah. Kakak bisa langsung simpan destinasi ini ke perencana rute (❤️ Itinerary)!`;
      } 
      else if (lowerText.includes('lempah') || lowerText.includes('gangan') || lowerText.includes('ikan') || lowerText.includes('seafood') || lowerText.includes('makan') || lowerText.includes('resto') || lowerText.includes('kuliner')) {
        matchedSpots = DESTINATIONS.filter(item => item.category === 'Restoran' && item.island === activeIsland);
        aiResponseText = `Wah, berwisata ke Bangka Belitung tidak lengkap tanpa mencicipi masakan sup berkuah kuning nanas pedas segar! Berikut adalah daftar rekomendasi restoran otentik pemenang selera warga lokal di Pulau ${activeIsland} untuk mengenyangkan perut Kakak:`;
      } 
      else if (lowerText.includes('kopi') || lowerText.includes('cafe') || lowerText.includes('nongkrong') || lowerText.includes('santai') || lowerText.includes('sarapan')) {
        matchedSpots = DESTINATIONS.filter(item => item.category === 'Cafe' && item.island === activeIsland);
        aiResponseText = `Masyarakat Bangka Belitung terkenal dengan budaya "Ngopi" yang kuat sejak zaman timah kolonial. Berikut adalah destinasi kedai Kopi Saring Arang kayu legendaris dan cafe bernuansa estetik di Pulau ${activeIsland}:`;
      } 
      else if (lowerText.includes('laskar') || lowerText.includes('pelangi') || lowerText.includes('sijuk') || lowerText.includes('belitung')) {
        matchedSpots = DESTINATIONS.filter(item => item.id.includes('l-pantai-1') || item.id.includes('l-pantai-2'));
        aiResponseText = `Destinasi Laskar Pelangi murni berada di barat laut pulau Belitung (Kecamatan Sijuk). Tempat wisatanya meliputi Pantai Tanjung Tinggi dengan batu pasir raksasa yang menjadi set shooting film, serta Tanjung Kelayang tempat menyewa kapal keliling pulau pasir:`;
      }
      else {
        // General fallback
        matchedSpots = DESTINATIONS.filter(item => item.island === activeIsland).slice(0, 3);
        aiResponseText = `Pertanyaan yang bagus Kak! Untuk menjelajahi keindahan Pulau ${activeIsland}, saya sangat meluncurkan rekomendasi destinasi top berikut yang wajib dikunjungi minimal satu kali seumur hidup:`;
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date(),
        suggestions: matchedSpots
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1100);
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-xs hover:shadow-subtle transition-all duration-300">
      {/* Bot Header */}
      <div 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-3.5 flex items-center justify-between border-b border-indigo-500/10 cursor-pointer select-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8.5 h-8.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center justify-center text-white ring-2 ring-white/5">
            <Bot className="w-4 h-4 text-emerald-400 animate-bounce-subtle" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 matches-label-alignment">
              <h4 className="text-xs sm:text-sm font-extrabold tracking-tight text-slate-100 flex items-center gap-1">
                🤖 NatakAI Travel Bot
              </h4>
              <span className="text-[8px] font-black font-mono tracking-wider bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded uppercase leading-none border border-emerald-500/20">
                PRO AI
              </span>
            </div>
            <p className="text-[9.5px] text-slate-400 leading-none mt-1">
              {isCollapsed ? "Klik untuk berkonsultasi mengenai petualangan Babel..." : "Konsultan pariwisata personal interaktif Anda"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-mono font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
            PINTAR OLEH GEMINI ✦
          </span>
          <button 
            type="button"
            className="text-slate-400 hover:text-white transition-colors focus:outline-none"
          >
            {isCollapsed ? (
              <ChevronDown className="w-5 h-5 text-indigo-400 animate-pulse" />
            ) : (
              <ChevronUp className="w-5 h-5 text-indigo-400" />
            )}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          {userStatus !== 'Premium' ? (
            /* LOCK STATE COVER */
            <div className="relative">
              {/* Blurred mock chat behind */}
              <div className="p-4 opacity-15 pointer-events-none select-none filter blur-xs space-y-3">
                <div className="flex items-start gap-2 max-w-lg">
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center" />
                  <div className="bg-gray-100 p-2.5 rounded-xl text-xs text-gray-400">Halo Kak! Butuh rekomendasi kuliner seafood legendaris di Sungailiat?</div>
                </div>
                <div className="flex items-start justify-end gap-2 text-right">
                  <div className="bg-blue-100 p-2.5 rounded-xl text-xs text-blue-850">Ya, tolong rekomendasikan lempah kuning terbaik di sekitar Pangkalpinang...</div>
                </div>
              </div>

              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-center p-5 text-white space-y-3">
                <div className="w-12 h-12 bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 rounded-full flex items-center justify-center text-xl font-bold animate-bounce-subtle shadow-md">
                  ✨
                </div>
                <div className="space-y-1 max-w-md">
                  <h4 className="text-xs sm:text-sm font-extrabold tracking-tight">buka asisten natakai travel consultant</h4>
                  <p className="text-[10.5px] text-slate-300 leading-relaxed max-w-xs sm:max-w-sm">
                    Fitur Eksklusif PRO untuk mengobrol, mencari pantai eksotis tersepi, mendapat rekomendasi warung kopi pecinan legendaris, dan langsung menyalin rute.
                  </p>
                </div>
                <button
                  onClick={onOpenUpgrade}
                  className="px-4.5 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-950 font-black rounded-lg text-[10.5px] uppercase tracking-wide shadow-lg active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 fill-slate-950" />
                  Gabung VIP (Rp 29k / 3 Bln)
                </button>
              </div>
            </div>
          ) : (
            /* ACTIVE CHATBOT INTERFACE (Compact Height of 320px) */
            <div className="flex flex-col h-[320px] transition-all duration-300">
              {/* Messages Flow */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 bg-slate-50/50">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 max-w-[88%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                  >
                    {/* Avatar Icon */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-xs ${
                      msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-900 border border-slate-700 text-white'
                    }`}>
                      {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5 text-yellow-300" />}
                    </div>

                    {/* Message Bubble Column */}
                    <div className="space-y-1.5 max-w-full">
                      <div className={`p-2.5 rounded-xl text-xs sm:text-[13px] shadow-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-tr-none'
                          : 'bg-white border border-gray-150 text-gray-800 rounded-tl-none whitespace-pre-wrap'
                      }`}>
                        {msg.text}
                      </div>

                      {/* Attachment matched tourism spots suggestions cards */}
                      {msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 max-w-full">
                          {msg.suggestions.slice(0, 4).map((spot) => {
                            const isFav = favorites.includes(spot.id);
                            return (
                              <div key={spot.id} className="bg-white border border-gray-150 hover:border-indigo-200 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between p-2 transition-all">
                                <div className="flex gap-2 items-start">
                                  {spot.imageUrl && (
                                    <img
                                      src={spot.imageUrl}
                                      alt={spot.name}
                                      referrerPolicy="no-referrer"
                                      className="w-10 h-10 object-cover rounded-lg shrink-0 border border-gray-100"
                                    />
                                  )}
                                  <div className="min-w-0 flex-1">
                                    <h5 className="text-[10.5px] font-black text-gray-800 truncate">{spot.name}</h5>
                                    <span className="text-[8.5px] font-extrabold font-mono text-indigo-500 uppercase">{spot.category}</span>
                                    <p className="text-[9.5px] text-gray-400 truncate">{spot.location}</p>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between border-t border-gray-100 pt-1.5 mt-1.5">
                                  <span className="text-[9.5px] font-bold text-amber-500 flex items-center gap-0.5">
                                    <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                                    {spot.rating}
                                  </span>
                                  <button
                                    onClick={() => onToggleFavorite(spot.id)}
                                    className={`text-[9px] font-extrabold px-2 py-0.5 rounded cursor-pointer transition-all ${
                                      isFav
                                        ? 'bg-red-50 text-red-600 border border-red-100'
                                        : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-100'
                                    }`}
                                  >
                                    {isFav ? '❤️ Disimpan' : '➕ Masukkan Rute'}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      <span className="text-[8.5px] text-gray-400 block px-1 tracking-wider">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-2 mr-auto">
                    <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5 text-yellow-300" />
                    </div>
                    <div className="bg-white border border-gray-150 p-2 px-3 rounded-xl rounded-tl-none flex items-center gap-1.5 shadow-xs">
                      <span className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={scrollRef} />
              </div>

              {/* Quick Help Tags */}
              <div className="p-1.5 border-t border-gray-100 bg-gray-50 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none select-none">
                <span className="text-[8.5px] font-mono uppercase font-black text-gray-400 shrink-0 pl-1">Saran Topik:</span>
                {starterQuestions.map((q) => (
                  <button
                    key={q.key}
                    onClick={() => handleSend(q.text)}
                    className="text-[9.5px] font-bold text-gray-600 hover:text-indigo-600 bg-white hover:bg-indigo-50 border border-gray-200 hover:border-indigo-100 px-2 py-0.5 rounded-full cursor-pointer transition-all shrink-0"
                  >
                    ✧ {q.text}
                  </button>
                ))}
              </div>

              {/* Input Form Box */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(input);
                }}
                className="p-2 border-t border-gray-100 bg-white flex gap-2"
              >
                <input
                  type="text"
                  placeholder={`Ketik tentang wisata ${activeIsland}...`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-gray-50/80 border border-gray-200 focus:border-indigo-400 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                />
                <button
                  type="submit"
                  className="p-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shrink-0 transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5 text-indigo-400" />
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
}

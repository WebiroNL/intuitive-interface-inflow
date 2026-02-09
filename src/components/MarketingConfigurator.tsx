import { useState } from 'react';
import { Check, Target, Mail, Bot, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Service {
  id: string;
  name: string;
  icon: React.ReactNode;
  price: number;
  description: string;
}

export function MarketingConfigurator() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const services: Service[] = [
    {
      id: 'google-ads',
      name: 'Google Ads',
      icon: <Target className="w-5 h-5" />,
      price: 500,
      description: 'Bereik klanten die actief zoeken naar jouw diensten'
    },
    {
      id: 'meta-ads',
      name: 'Meta Ads (Facebook & Instagram)',
      icon: <Target className="w-5 h-5" />,
      price: 500,
      description: 'Adverteer op het grootste social media platform'
    },
    {
      id: 'tiktok-ads',
      name: 'TikTok Ads',
      icon: <Target className="w-5 h-5" />,
      price: 500,
      description: 'Bereik een jonger publiek met korte video content'
    },
    {
      id: 'email-automation',
      name: 'E-mail Marketing Automation',
      icon: <Mail className="w-5 h-5" />,
      price: 350,
      description: 'Automatische e-mail flows en lead nurturing'
    },
    {
      id: 'whatsapp-automation',
      name: 'WhatsApp Automation',
      icon: <Mail className="w-5 h-5" />,
      price: 400,
      description: 'Automatische berichten en klantenservice via WhatsApp'
    },
    {
      id: 'ai-chatbot',
      name: 'AI Support Chatbot',
      icon: <Bot className="w-5 h-5" />,
      price: 450,
      description: '24/7 klantenondersteuning met AI'
    }
  ];

  const toggleService = (id: string) => {
    setSelectedServices(prev => 
      prev.includes(id) 
        ? prev.filter(s => s !== id)
        : [...prev, id]
    );
  };

  const totalPrice = services
    .filter(s => selectedServices.includes(s.id))
    .reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="bg-white dark:bg-[#1A1720] rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-800">
      <h3 className="text-2xl font-bold text-[#110E13] dark:text-white mb-2">
        Stel je marketingpakket samen
      </h3>
      <p className="text-[#110E13]/70 dark:text-gray-400 mb-8">
        Selecteer de diensten die je nodig hebt en ontvang direct een prijsindicatie
      </p>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {services.map(service => (
          <button
            key={service.id}
            onClick={() => toggleService(service.id)}
            className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
              selectedServices.includes(service.id)
                ? 'border-[#3A4DEA] bg-[#3A4DEA]/5 dark:bg-[#3A4DEA]/10'
                : 'border-gray-200 dark:border-gray-700 hover:border-[#3A4DEA]/50'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              selectedServices.includes(service.id)
                ? 'bg-[#3A4DEA] text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
            }`}>
              {selectedServices.includes(service.id) ? (
                <Check className="w-5 h-5" />
              ) : (
                service.icon
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <span className="font-semibold text-[#110E13] dark:text-white">
                  {service.name}
                </span>
                <span className="text-[#3A4DEA] font-bold">
                  €{service.price}/mnd
                </span>
              </div>
              <p className="text-sm text-[#110E13]/60 dark:text-gray-400 mt-1">
                {service.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Total & CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div>
          <p className="text-sm text-[#110E13]/60 dark:text-gray-400">
            Geschatte maandelijkse kosten
          </p>
          <p className="text-3xl font-bold text-[#3A4DEA]">
            €{totalPrice}<span className="text-lg font-normal">/maand</span>
          </p>
          <p className="text-xs text-[#110E13]/50 dark:text-gray-500">
            Exclusief BTW en advertentiebudget
          </p>
        </div>
        
        <Link
          to="/contact"
          className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all ${
            selectedServices.length > 0
              ? 'bg-[#3A4DEA] text-white hover:bg-[#2f3ec7] shadow-lg hover:shadow-xl'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          Plan een strategiecall
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}

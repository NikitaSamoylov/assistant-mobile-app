declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }

  interface SpeechRecognition extends EventTarget {
    start(): void;
    stop(): void;
    continuous?: boolean;
    lang?: string;
    onresult?: (event: SpeechRecognitionEvent) => void;
  }

  interface SpeechRecognitionEvent extends Event {
    resultIndex: number;
    results: SpeechRecognitionResultList;
  }

  interface SpeechRecognitionResultList extends Array<SpeechRecognitionResult> { }

  interface SpeechRecognitionResult {
    readonly isFinal: boolean;
    readonly length: number;
    [index: number]: SpeechRecognitionAlternative;
  }

  interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
  }
}

import { useState, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
}

interface VoiceDeleteProductProps {
  products: Product[];
  onDelete: (name: string) => void;
}

//========================================================================================================

export const VoiceDeleteProduct: React.FC<VoiceDeleteProductProps> = ({ products, onDelete }) => {
  const [list, setList] = useState<Product[]>(products);

  useEffect(() => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      console.error('Speech Recognition API не поддерживается в этом браузере.');
      return;
    }

    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.lang = 'ru-RU';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          const transcript = event.results[i][0].transcript.toLowerCase();
          if (transcript.includes('удалить продукт')) {
            const productName = transcript.replace('удалить продукт', '').trim();
            deleteProduct(productName);
          }
        }
      }
    };

    recognition.start();

    return () => {
      recognition.stop();
    };
  }, [list]);

  const deleteProduct = (name: string) => {
    const updatedList = list.filter((product) => product.name.toLowerCase() !== name.toLowerCase());
    setList(updatedList);
    onDelete(name);
  };

  return (
    <ul>
      {list.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
};

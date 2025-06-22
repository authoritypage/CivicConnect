import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Lightbulb, User, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function AIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hello! I'm your **Santa Barbara County Accountability Assistant**. I can help you investigate:\n\n• **Corruption cases** and active investigations\n• **Officer records** and status updates\n• **City transparency scores** and patterns\n• **Data analysis** across the county\n\nWhat would you like to investigate?",
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const { toast } = useToast();

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/chat", { message });
      return response.json();
    },
    onSuccess: (data) => {
      const aiMessage: ChatMessage = {
        id: Date.now().toString() + '_ai',
        content: data.response,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
      console.error('Chat error:', error);
    },
  });

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString() + '_user',
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    chatMutation.mutate(inputMessage);
    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <section className="mb-12">
      <Card className="bg-gov-gray border-gov-steel">
        <CardContent className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gov-text mb-2">AI Investigation Assistant</h2>
            <p className="text-gov-text-secondary">Ask questions about corruption cases, officer records, and transparency data</p>
          </div>
          
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex items-start space-x-3 ${message.sender === 'user' ? 'justify-end' : ''}`}
              >
                {message.sender === 'ai' && (
                  <div className="w-8 h-8 bg-gov-steel rounded-full flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-4 h-4 text-gov-text" />
                  </div>
                )}
                <div className={`rounded-lg p-4 max-w-md ${
                  message.sender === 'ai' 
                    ? 'bg-gov-charcoal' 
                    : 'bg-gov-steel'
                }`}>
                  <div 
                    className="text-gov-text text-sm whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: message.content
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        .replace(/^### (.*$)/gim, '<h3 class="text-base font-semibold mb-2">$1</h3>')
                        .replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold mb-2">$1</h2>')
                        .replace(/^# (.*$)/gim, '<h1 class="text-xl font-bold mb-3">$1</h1>')
                        .replace(/^• (.*$)/gim, '<li class="ml-4">• $1</li>')
                        .replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>')
                    }}
                  />
                </div>
                {message.sender === 'user' && (
                  <div className="w-8 h-8 bg-gov-text rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-gov-black" />
                  </div>
                )}
              </div>
            ))}
            {chatMutation.isPending && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gov-steel rounded-full flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-4 h-4 text-gov-text" />
                </div>
                <div className="bg-gov-charcoal rounded-lg p-4 max-w-md">
                  <p className="text-gov-text text-sm">Thinking...</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Ask about corruption cases, officer records, or transparency data..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full bg-gov-steel border-gov-charcoal text-gov-text placeholder-gov-text-secondary focus:border-gov-text-secondary"
                disabled={chatMutation.isPending}
              />
            </div>
            <Button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || chatMutation.isPending}
              className="bg-gov-text text-gov-black hover:bg-gov-text-secondary"
            >
              <Send className="w-4 h-4 mr-2" />
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

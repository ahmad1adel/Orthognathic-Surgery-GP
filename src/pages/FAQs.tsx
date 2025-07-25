import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQs: React.FC = () => {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-16">Frequently Asked Questions</h1>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>How accurate is the AI analysis?</AccordionTrigger>
            <AccordionContent>Our AI models achieve 95% accuracy in jaw deformity classification.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Is my data secure?</AccordionTrigger>
            <AccordionContent>Yes, we are 100% HIPAA compliant with end-to-end encryption.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default FAQs;
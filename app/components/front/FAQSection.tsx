"use client";
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/front/accordion";


export default function FAQSection() {
  const faqData = [
    {
      question: "Can I write my entire thesis or dissertation on DS?",
      answer: "Yes. DS provides a complete writing environment where you can draft, edit, and manage your entire research project — from proposal to final submission. Your work is automatically saved in the cloud, and you can export individual chapters or the full document in word or PDF anytime."
    },
    {
      question: "What happens after I choose my research topic?",
      answer: "After topic evaluation and approval, you select your project type (Research Proposal, Thesis/Dissertation, or Grant). You then set your project's start and end dates, allocate durations for each section, and DS automatically generates a Gantt chart to guide your writing process."
    },
    {
      question: "How does DS help me stay on schedule?",
      answer: "DS monitors your writing progress and sends reminders when you're spending more time than planned on any section. Your dashboard displays both overall completion and chapter-by-chapter progress, keeping you motivated and organized."
    },
    {
      question: "Can I find research mentors on DS?",
      answer: "Yes. The Academic Mentor Community connects you with verified academics worldwide. Mentors register using their institutional email, and you can search by area of expertise or institution. Mentorship sessions are offered at rates determined by each mentor."
    },
    {
      question: "Can DS be adapted to my institution's postgraduate guidelines?",
      answer: "Absolutely. Institutions can partner with us to customize the DS framework according to their postgraduate thesis and dissertation requirements, ensuring alignment with their internal guidelines."
    }
  ];

  return (
    <div className="bg-primary-bg py-12 sm:py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4 sm:mb-6 md:mb-8">
            Frequently Asked Questions
          </h2>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
          {faqData.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-surface-muted rounded-lg px-3 sm:px-4 md:px-6 border-0"
            >
              <AccordionTrigger className="text-left text-base sm:text-lg md:text-xl font-medium text-primary hover:no-underline py-4 sm:py-5 md:py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-secondary text-sm sm:text-base md:text-lg leading-relaxed pb-4 sm:pb-5 md:pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

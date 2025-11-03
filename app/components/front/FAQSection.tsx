"use client";
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/front/accordion";


export default function FAQSection() {
  const faqData = [
    {
      question: "What is research topic evaluation?",
      answer: "Research topic evaluation is a comprehensive analysis that assesses your research idea across six key metrics: novelty, trends, methodological complexity, research gaps, grant potential, and impact. This helps you understand the viability and potential of your research before investing significant time and resources."
    },
    {
      question: "How does Dessert Scaffold help with grant applications?",
      answer: "Dessert Scaffold analyzes your research topic against current funding priorities from major agencies like NSF, NIH, and others. It provides grant potential scores, identifies relevant funding opportunities, estimates budget requirements, and suggests strategies to improve your proposal's success rate."
    },
    {
      question: "What metrics does Dessert Scaffold analyze?",
      answer: "Dessert Scaffold evaluates six critical dimensions: Novelty (innovation and uniqueness), Grant Potential (funding alignment and success probability), Research Gaps (literature gaps and opportunities), Trends (market and publication trends), Methodology (complexity and feasibility), and Impact (scientific and social significance)."
    },
    {
      question: "How accurate is the grant potential assessment?",
      answer: "Our grant potential analysis is based on extensive databases of successful grants, current funding priorities, and historical success patterns. While we can't guarantee funding, our assessments have helped researchers improve their grant success rates by an average of 40%."
    },
    {
      question: "Can Dessert Scaffold help with interdisciplinary research?",
      answer: "Yes, Dessert Scaffold excels at evaluating interdisciplinary research topics. Our system can analyze cross-disciplinary novelty, identify funding opportunities across multiple agencies, and assess the complexity of integrating different methodologies and approaches."
    },
    {
      question: "How long does the evaluation process take?",
      answer: "Most research topic evaluations are completed within 5-10 minutes. The system analyzes your topic against our comprehensive databases and provides detailed reports with actionable insights, funding recommendations, and strategic guidance."
    },
    {
      question: "Is Dessert Scaffold suitable for all research fields?",
      answer: "Yes, Dessert Scaffold supports evaluation across all academic disciplines including STEM, social sciences, humanities, and interdisciplinary fields. Our database includes funding opportunities, trends, and methodologies relevant to virtually every research area."
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

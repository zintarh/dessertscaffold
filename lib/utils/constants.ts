import { TimelineSection } from "@/types";

export const DISSERTATION: TimelineSection[] = [
  {
    id: "abstract",
    title: "Abstract",
    description:
      "Comprehensive summary of the dissertation including methodology, findings, and conclusions.",
    whatToInclude: [
      "Research problem",
      "Methodology",
      "Key findings",
      "Conclusions",
      "Implications",
    ],
    proTips: [
      "Keep it concise (300-500 words)",
      "Write it last after completing all chapters",
      "Include quantifiable results",
    ],
    duration: 1,
    status: "not-started",
    isCompleted: false,
  },
  {
    id: "introduction",
    title: "Introduction",
    description:
      "The introduction sets the stage for your research by providing context, background, and the rationale for your study. It should engage readers and clearly articulate why your research is important.",
    whatToInclude: [
      "Background information on the topic",
      "Statement of the research problem",
      "Research questions and/or hypotheses",
      "Significance of the study",
      "Scope and limitations",
      "Definition of key terms",
    ],
    proTips: [
      "Start broad and narrow down to your specific focus",
      "Use recent statistics or compelling facts to engage readers",
      "Clearly state the gap in knowledge your research addresses",
      "Avoid jargon; write for an educated but non-specialist audience",
      "Consider writing this section after completing your literature review",
    ],
    duration: 3,
    status: "not-started",
    isCompleted: false,
  },
  {
    id: "literature-review",
    title: "Literature Review",
    description:
      "The literature review critically evaluates existing research relevant to your topic. It synthesizes previous findings, identifies gaps, and establishes the theoretical framework for your study.",
    whatToInclude: [
      "Comprehensive review of relevant literature",
      "Critical analysis of previous research",
      "Identification of research gaps",
      "Theoretical framework",
      "Conceptual definitions",
      "Synthesis of findings across studies",
    ],
    proTips: [
      "Organize literature thematically or conceptually",
      "Don't just summarize—critically analyze and synthesize",
      "Identify controversies or debates in the field",
      "Highlight how your research addresses gaps",
      "Use a matrix or table to compare studies if helpful",
    ],
    duration: 4,
    status: "not-started",
    isCompleted: false,
  },
  {
    id: "methodology",
    title: "Research Methodology",
    description:
      "This section describes the research design, data collection methods, and analysis techniques. It should provide enough detail for another researcher to replicate your study.",
    whatToInclude: [
      "Research design and approach",
      "Population and sampling strategy",
      "Data collection methods and procedures",
      "Data analysis techniques",
      "Validity and reliability considerations",
      "Ethical considerations",
    ],
    proTips: [
      "Justify your choice of methodology",
      "Be specific about procedures and instruments",
      "Address potential limitations of your methods",
      "Explain how you'll ensure validity and reliability",
      "Consider including a visual representation of your research design",
    ],
    duration: 3,
    status: "not-started",
    isCompleted: false,
  },

  {
    id: "results",
    title: "Results",
    description:
      "The results section presents the findings of your research without interpretation. It should be organized logically and include appropriate tables, figures, and statistical analyses.",
    whatToInclude: [
      "Presentation of research findings",
      "Statistical analysis results",
      "Tables and figures with clear labels",
      "Objective reporting of data",
      "Organization by research questions or hypotheses",
    ],
    proTips: [
      "Present results objectively without interpretation",
      "Use tables and figures to summarize complex data",
      "Follow a logical organization (e.g., by research questions)",
      "Report all findings, including those that don't support your hypotheses",
      "Use appropriate statistical notation and formatting",
    ],
    duration: 4,
    status: "not-started",
    isCompleted: false,
  },

  {
    id: "discussion",
    title: "Discussion",
    description:
      "The discussion interprets your results, explains their significance, and relates them to previous research. It should address the implications of your findings and acknowledge limitations.",
    whatToInclude: [
      "Interpretation of results",
      "Comparison with previous research",
      "Theoretical and practical implications",
      "Limitations of the study",
      "Suggestions for future research",
    ],
    proTips: [
      "Begin with a summary of your main findings",
      "Discuss how your results relate to your original hypotheses",
      "Compare your findings with previous research",
      "Acknowledge limitations honestly",
      "End with the broader implications of your work",
    ],
    duration: 3,
    status: "not-started",
    isCompleted: false,
  },

  {
    id: "conclusion",
    title: "Conclusion",
    description:
      "The conclusion summarizes your research proposal and reinforces its significance. It should leave readers with a clear understanding of your research's value and contribution.",
    whatToInclude: [
      "Summary of key points",
      "Restatement of research significance",
      "Expected outcomes and contributions",
      "Implications for theory and practice",
      "Limitations of the study",
      "Suggestions for future research",
    ],
    proTips: [
      "Don't introduce new information in the conclusion",
      "Emphasize the unique contribution of your research",
      "Connect your findings to broader issues in the field",
      "Be concise and focused",
      "End with a strong statement about the importance of your work",
    ],
    duration: 2,
    status: "not-started",
    isCompleted: false,
  },
  {
    id: "references",
    title: "References",
    description:
      "The references section lists all sources cited in your proposal. It should follow a consistent citation style and demonstrate thorough engagement with relevant literature.",
    whatToInclude: [
      "Complete list of all cited sources",
      "Consistent formatting style",
      "Alphabetical organization",
      "Proper citation format for different source types",
      "DOI or URL links where applicable",
      "Recent and seminal works in the field",
    ],
    proTips: [
      "Use reference management software to maintain consistency",
      "Include a mix of recent and foundational sources",
      "Ensure all in-text citations have corresponding references",
      "Follow the required citation style precisely",
      "Consider including annotated references for key sources",
    ],
    duration: 1,
    status: "not-started",
    isCompleted: false,
  },
  {
    id: "appendices",
    title: "Appendices",
    description:
      "Appendices contain supplementary materials that are too detailed for the main body of your dissertation but important for completeness.",
    whatToInclude: [
      "Raw data or supplementary tables",
      "Copies of instruments or questionnaires",
      "Informed consent forms",
      "Detailed statistical analyses",
      "Additional figures or tables",
    ],
    proTips: [
      "Include only essential supplementary materials",
      "Label each appendix clearly (Appendix A, Appendix B, etc.)",
      "Reference each appendix in the main text",
      "Ensure materials are well-organized and easy to follow",
      "Consider including an IRB approval letter if applicable",
    ],
    duration: 1,
    status: "not-started",
    isCompleted: false,
  },
];

export const RESEARCH_PROPOSAL_SECTIONS: TimelineSection[] = [
  {
    id: "executive-summary",
    title: "Executive Summary",
    description:
      "The executive summary provides a concise overview of your entire research proposal. It should highlight the key points of your proposal, including the research problem, objectives, methodology, and expected outcomes.",
    whatToInclude: [
      "Clear statement of the research problem",
      "Research objectives and questions",
      "Brief description of methodology",
      "Expected outcomes and significance",
      "Timeline overview",
    ],
    proTips: [
      "Write this section last, even though it appears first",
      "Keep it concise (typically 200-300 words)",
      "Use clear, accessible language",
      "Highlight the unique contribution of your research",
      "Ensure it stands alone as a summary of the entire proposal",
    ],
    duration: 1,
    status: "not-started",
    isCompleted: false,
  },

  {
    id: "introduction",
    title: "Introduction",
    description:
      "The introduction sets the stage for your research by providing context, background, and the rationale for your study. It should engage readers and clearly articulate why your research is important.",
    whatToInclude: [
      "Background information on the topic",
      "Statement of the research problem",
      "Research questions and/or hypotheses",
      "Significance of the study",
      "Scope and limitations",
      "Definition of key terms",
    ],
    proTips: [
      "Start broad and narrow down to your specific focus",
      "Use recent statistics or compelling facts to engage readers",
      "Clearly state the gap in knowledge your research addresses",
      "Avoid jargon; write for an educated but non-specialist audience",
      "Consider writing this section after completing your literature review",
    ],
    duration: 2,
    status: "not-started",
    isCompleted: false,
  },

  {
    id: "background-rationale",
    title: "Background/Rationale",
    description:
      "This section provides the context and justification for your research. It explains the theoretical framework and establishes the need for your study by reviewing relevant literature and identifying gaps.",
    whatToInclude: [
      "Historical context of the research topic",
      "Theoretical foundations",
      "Review of relevant literature",
      "Identification of research gaps",
      "Justification for the research approach",
      "Potential contributions to the field",
    ],
    proTips: [
      "Organize thematically rather than chronologically",
      "Critically analyze existing literature, don't just summarize",
      "Clearly articulate how your research fills identified gaps",
      "Connect your research to broader theoretical frameworks",
      "Use headings and subheadings to improve readability",
    ],
    duration: 2,
    status: "not-started",
    isCompleted: false,
  },

  {
    id: "problem-statement",
    title: "Problem Statement",
    description:
      "The problem statement clearly defines the specific issue your research addresses. It should be concise, focused, and demonstrate the significance of the problem.",
    whatToInclude: [
      "Clear identification of the research problem",
      "Evidence of the problem's existence",
      "Explanation of why the problem matters",
      "Discussion of consequences if the problem remains unsolved",
      "Connection to broader issues in the field",
    ],
    proTips: [
      "Be specific and focused rather than broad",
      "Support your claims with evidence from literature",
      "Frame the problem in a way that highlights its significance",
      "Ensure the problem is researchable within your constraints",
      "Avoid problem statements that are too vague or too broad",
    ],
    duration: 1,
    status: "not-started",
    isCompleted: false,
  },

  {
    id: "literature-review",
    title: "Literature Review",
    description:
      "The literature review critically evaluates existing research relevant to your topic. It synthesizes previous findings, identifies gaps, and establishes the theoretical framework for your study.",
    whatToInclude: [
      "Comprehensive review of relevant literature",
      "Critical analysis of previous research",
      "Identification of research gaps",
      "Theoretical framework",
      "Conceptual definitions",
      "Synthesis of findings across studies",
    ],
    proTips: [
      "Organize literature thematically or conceptually",
      "Don't just summarize—critically analyze and synthesize",
      "Identify controversies or debates in the field",
      "Highlight how your research addresses gaps",
      "Use a matrix or table to compare studies if helpful",
    ],
    duration: 3,
    status: "not-started",
    isCompleted: false,
  },

  {
    id: "methodology",
    title: "Research Methodology",
    description:
      "This section describes the research design, data collection methods, and analysis techniques. It should provide enough detail for another researcher to replicate your study.",
    whatToInclude: [
      "Research design and approach",
      "Population and sampling strategy",
      "Data collection methods and procedures",
      "Data analysis techniques",
      "Validity and reliability considerations",
      "Ethical considerations",
    ],
    proTips: [
      "Justify your choice of methodology",
      "Be specific about procedures and instruments",
      "Address potential limitations of your methods",
      "Explain how you'll ensure validity and reliability",
      "Consider including a visual representation of your research design",
    ],
    duration: 2,
    status: "not-started",
    isCompleted: false,
  },

  {
    id: "research-ethics",
    title: "Research Ethics",
    description:
      "This section addresses ethical considerations related to your research. It demonstrates your awareness of potential ethical issues and explains how you'll address them.",
    whatToInclude: [
      "Informed consent procedures",
      "Confidentiality and anonymity measures",
      "Data security protocols",
      "Potential risks to participants",
      "Benefits of the research",
      "Institutional review board approval process",
    ],
    proTips: [
      "Be thorough in addressing all potential ethical concerns",
      "Explain how you'll protect vulnerable populations",
      "Detail data storage and destruction procedures",
      "Consider cultural sensitivities in your research context",
      "Include sample consent forms as an appendix if applicable",
    ],
    duration: 1,
    status: "not-started",
    isCompleted: false,
  },

  {
    id: "scheduling",
    title: "Schedule",
    description:
      "The schedule outlines the timeline for completing your research. It breaks down the research process into manageable phases with specific timeframes.",
    whatToInclude: [
      "Detailed timeline with milestones",
      "Key activities and tasks",
      "Time allocation for each phase",
      "Dependencies between tasks",
      "Contingency time for unexpected delays",
      "Completion date for each phase",
    ],
    proTips: [
      "Be realistic in your time estimates",
      "Build in buffer time for unexpected delays",
      "Identify critical path activities",
      "Consider using project management software or tools",
      "Review and adjust your schedule regularly as you progress",
    ],
    duration: 1,
    status: "not-started",
    isCompleted: false,
  },

  {
    id: "conclusion",
    title: "Conclusion",
    description:
      "The conclusion summarizes your research proposal and reinforces its significance. It should leave readers with a clear understanding of your research's value and contribution.",
    whatToInclude: [
      "Summary of key points",
      "Restatement of research significance",
      "Expected outcomes and contributions",
      "Implications for theory and practice",
      "Limitations of the study",
      "Suggestions for future research",
    ],
    proTips: [
      "Don't introduce new information in the conclusion",
      "Emphasize the unique contribution of your research",
      "Connect your findings to broader issues in the field",
      "Be concise and focused",
      "End with a strong statement about the importance of your work",
    ],
    duration: 1,
    status: "not-started",
    isCompleted: false,
  },
  {
    id: "references",
    title: "References",
    description:
      "The references section lists all sources cited in your proposal. It should follow a consistent citation style and demonstrate thorough engagement with relevant literature.",
    whatToInclude: [
      "Complete list of all cited sources",
      "Consistent formatting style",
      "Alphabetical organization",
      "Proper citation format for different source types",
      "DOI or URL links where applicable",
      "Recent and seminal works in the field",
    ],
    proTips: [
      "Use reference management software to maintain consistency",
      "Include a mix of recent and foundational sources",
      "Ensure all in-text citations have corresponding references",
      "Follow the required citation style precisely",
      "Consider including annotated references for key sources",
    ],
    duration: 1,
    status: "not-started",
    isCompleted: false,
  },
];

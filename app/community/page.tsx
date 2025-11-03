"use client";
import Navbar from "../components/front/Navbar";
import { Search, ChevronDown, } from "lucide-react";
import { useState } from "react";
import Footer from "../components/front/Footer";

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedAudiences, setSelectedAudiences] = useState<string[]>([]);

  const topics = [
    { name: "AI & Machine Learning", count: 45 },
    { name: "Biomedical Research", count: 38 },
    { name: "Climate Science", count: 22 },
    { name: "Quantum Computing", count: 15 },
    { name: "Data Science", count: 31 },
    { name: "Materials Science", count: 18 },
    { name: "Neuroscience", count: 25 },
    { name: "Renewable Energy", count: 12 },
    { name: "Grant Writing", count: 15 },
    { name: "Research Methodology", count: 22 },
    { name: "Funding Opportunities", count: 31 },
    { name: "Publication Strategy", count: 8 },
  ];

  const audiences = [
    { name: "PhD Students", count: 45 },
    { name: "Faculty", count: 38 },
    { name: "Postdocs", count: 22 },
    { name: "Grant Writers", count: 15 },
    { name: "Research Directors", count: 12 },
  ];

  const mentors = [
    {
      id: 1,
      name: "Dr. Sarah Chen",
      title: "Professor of Computer Science",
      institution: "MIT",
      location: "Cambridge, MA",
      specialties: ["AI & Machine Learning", "Data Science"],
      rating: 4.9,
      reviews: 127,
      availability: "Available Now",
      image: "/d1.avif",
      bio: "Leading researcher in AI applications for healthcare. 15+ years experience mentoring PhD students.",
      hourlyRate: "$150",
      responseTime: "2 hours",
      languages: ["English", "Mandarin"],
      achievements: ["NSF Career Award", "IEEE Fellow", "50+ Publications"],
    },
    {
      id: 2,
      name: "Prof. Maria Rodriguez",
      title: "Associate Professor of Biology",
      institution: "Stanford University",
      location: "Stanford, CA",
      specialties: ["Biomedical Research", "Neuroscience"],
      rating: 4.8,
      reviews: 89,
      availability: "This Week",
      image: "/d2.avif",
      bio: "Expert in molecular biology and drug discovery. Passionate about supporting underrepresented students.",
      hourlyRate: "$120",
      responseTime: "4 hours",
      languages: ["English", "Spanish"],
      achievements: [
        "NIH Grant Recipient",
        "Nature Publications",
        "Mentor of the Year",
      ],
    },
    {
      id: 3,
      name: "Dr. James Wilson",
      title: "Professor of Physics",
      institution: "Harvard University",
      location: "Cambridge, MA",
      specialties: ["Quantum Computing", "Materials Science"],
      rating: 4.9,
      reviews: 156,
      availability: "Next Week",
      image: "/d3.avif",
      bio: "Quantum computing pioneer with extensive industry connections. Mentored 30+ successful PhD graduates.",
      hourlyRate: "$180",
      responseTime: "1 hour",
      languages: ["English"],
      achievements: [
        "Nobel Prize Nominee",
        "Nature Physics Editor",
        "50+ Patents",
      ],
    },
    {
      id: 4,
      name: "Dr. Lisa Park",
      title: "Assistant Professor of Environmental Science",
      institution: "UC Berkeley",
      location: "Berkeley, CA",
      specialties: ["Climate Science", "Renewable Energy"],
      rating: 4.7,
      reviews: 73,
      availability: "By Appointment",
      image: "/d4.avif",
      bio: "Climate change researcher focused on sustainable solutions. Strong advocate for diversity in STEM.",
      hourlyRate: "$100",
      responseTime: "6 hours",
      languages: ["English", "Korean"],
      achievements: ["Climate Action Award", "Science Magazine", "UN Advisor"],
    },
    {
      id: 5,
      name: "Dr. Ahmed Hassan",
      title: "Professor of Engineering",
      institution: "Caltech",
      location: "Pasadena, CA",
      specialties: ["Materials Science", "Data Science"],
      rating: 4.8,
      reviews: 94,
      availability: "Available Now",
      image: "/d1.avif",
      bio: "Materials engineering expert with focus on renewable energy applications. International collaboration experience.",
      hourlyRate: "$140",
      responseTime: "3 hours",
      languages: ["English", "Arabic"],
      achievements: [
        "Materials Research Society Fellow",
        "Energy Innovation Award",
        "100+ Citations",
      ],
    },
    {
      id: 6,
      name: "Prof. Jennifer Liu",
      title: "Professor of Neuroscience",
      institution: "Princeton University",
      location: "Princeton, NJ",
      specialties: ["Neuroscience", "AI & Machine Learning"],
      rating: 4.9,
      reviews: 112,
      availability: "This Week",
      image: "/d2.avif",
      bio: "Neuroscience researcher specializing in brain-computer interfaces. Dedicated to mentoring women in STEM.",
      hourlyRate: "$160",
      responseTime: "2 hours",
      languages: ["English", "Mandarin"],
      achievements: [
        "Brain Research Award",
        "Nature Neuroscience",
        "Women in Science Award",
      ],
    },
  ];

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const toggleAudience = (audience: string) => {
    setSelectedAudiences((prev) =>
      prev.includes(audience)
        ? prev.filter((a) => a !== audience)
        : [...prev, audience]
    );
  };

  const clearAllFilters = () => {
    setSelectedTopics([]);
    setSelectedAudiences([]);
    setSearchQuery("");
  };

  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      searchQuery === "" ||
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.specialties.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesTopics =
      selectedTopics.length === 0 ||
      selectedTopics.some((topic) => mentor.specialties.includes(topic));

    const matchesAudiences =
      selectedAudiences.length === 0 ||
      selectedAudiences.includes(mentor.institution);

    return matchesSearch && matchesTopics && matchesAudiences;
  });

  return (
    <div className="min-h-screen bg-primary-bg">
      <Navbar />

        <div className="py-8 sm:py-12 md:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">

               <div className="flex items-center justify-center h-[400px]">
                    <p className="text-secondary text-lg font-medium">Coming soon...</p>
                  </div>
            {/* <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              <div className="lg:w-80 flex-shrink-0">

              
                  <div className="bg-surface rounded-2xl sm:rounded-3xl shadow-sm border border-default p-4 sm:p-6 sticky top-8">
                    <div className="mb-6">

                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tertiary w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search mentors..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-default rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none transition-all duration-200 bg-transparent text-primary placeholder:text-tertiary"
                        />

                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-primary">
                          Topics
                        </h3>
                        <ChevronDown className="w-4 h-4 text-tertiary" />
                      </div>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {topics.map((topic) => (
                          <label
                            key={topic.name}
                            className="flex items-center space-x-3 cursor-pointer group"
                          >
                            <input
                              type="checkbox"
                              checked={selectedTopics.includes(topic.name)}
                              onChange={() => toggleTopic(topic.name)}
                              className="w-4 h-4 text-[var(--accent)] border-default rounded focus:ring-[var(--accent)] bg-transparent"
                            />
                            <span className="text-sm text-secondary group-hover:text-primary transition-colors">
                              {topic.name}
                            </span>
                            <span className="text-xs text-tertiary ml-auto">
                              {topic.count}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-primary">
                          Audiences
                        </h3>
                        <ChevronDown className="w-4 h-4 text-tertiary" />
                      </div>
                      <div className="space-y-2">
                        {audiences.map((audience) => (
                          <label
                            key={audience.name}
                            className="flex items-center space-x-3 cursor-pointer group"
                          >
                            <input
                              type="checkbox"
                              checked={selectedAudiences.includes(
                                audience.name
                              )}
                              onChange={() => toggleAudience(audience.name)}
                              className="w-4 h-4 text-[var(--accent)] border-default rounded focus:ring-[var(--accent)] bg-transparent"
                            />
                            <span className="text-sm text-secondary group-hover:text-primary transition-colors">
                              {audience.name}
                            </span>
                            <span className="text-xs text-tertiary ml-auto">
                              {audience.count}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-default">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-secondary">
                          {filteredMentors.length} out of {mentors.length}{" "}
                          mentors
                        </span>
                        {(selectedTopics.length > 0 ||
                          selectedAudiences.length > 0 ||
                          searchQuery) && (
                          <button
                            onClick={clearAllFilters}
                            className="text-sm text-accent hover:opacity-80 font-medium transition-colors"
                          >
                            Reset all filters
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-1">

                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {filteredMentors.map((mentor, index) => (
                      <div key={mentor.id} className="bg-surface rounded-xl sm:rounded-2xl shadow-sm border border-default overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer">
                          <div className="relative h-48 sm:h-56 bg-surface-muted">
                            <div
                              className="w-full h-full bg-cover bg-center bg-no-repeat"
                              style={{
                                backgroundImage: `url(${mentor.image})`,
                              }}
                            >
                              <div className="absolute inset-0 bg-black/20"></div>
                            </div>
                          </div>

                          <div className="p-4 sm:p-6">
                            <div className="mb-3">
                              <span className="bg-accent-soft text-accent text-xs font-medium px-2 py-1 rounded-full">
                                {mentor.specialties[0]}
                              </span>
                            </div>

                            <h3 className="text-lg sm:text-xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">
                              {mentor.name}
                            </h3>

                            <p className="text-sm text-secondary mb-3">
                              {mentor.title}
                            </p>

                            <div className="mb-4">
                              <span className="bg-surface-muted text-secondary text-xs font-medium px-2 py-1 rounded-full">
                                {mentor.institution}
                              </span>
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>

                 

                  {filteredMentors.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-surface-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-tertiary" />
                      </div>
                      <h3 className="text-lg font-semibold text-primary mb-2">
                        No mentors found
                      </h3>
                      <p className="text-secondary mb-4">
                        Try adjusting your search or filters
                      </p>
                      <button
                        onClick={clearAllFilters}
                        className="text-accent hover:opacity-80 font-medium transition-colors"
                      >
                        Clear all filters
                      </button>
                    </div>
                  )}
                </div>
            </div> */}
          </div>
        </div>

        {/* Footer */}
        <Footer />
    </div>
  );
}

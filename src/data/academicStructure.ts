import { AcademicJourney } from '../types';

export interface SubjectUnit {
  unitName: string;
  chapters: string[];
}

export interface SubjectDefinition {
  id: string;
  name: string;
  code?: string;
  description: string;
  iconName: string;
  units?: SubjectUnit[];
  chapters: string[];
}

export interface JourneyDefinition {
  id: AcademicJourney;
  title: string;
  subtitle: string;
  badge: string;
  defaultLevel: string;
  subjects: SubjectDefinition[];
}

export const ACADEMIC_JOURNEYS: Record<AcademicJourney, JourneyDefinition> = {
  CLASS_12: {
    id: 'CLASS_12',
    title: 'Class 12 Commerce & Arts',
    subtitle: 'Senior Secondary CBSE Board & State Syllabus',
    badge: 'Class 12 Board',
    defaultLevel: 'Class 12 CBSE',
    subjects: [
      {
        id: 'c12_accountancy',
        name: 'Accountancy',
        description: 'Partnership, Company Accounts, Financial Statements & Cash Flow',
        iconName: 'Calculator',
        units: [
          {
            unitName: 'Unit 1: Accounting for Partnership Firms',
            chapters: [
              'Fundamentals of Partnership',
              'Goodwill: Nature and Valuation',
              'Admission of a Partner',
              'Retirement and Death of a Partner',
              'Dissolution of Partnership Firm'
            ]
          },
          {
            unitName: 'Unit 2: Accounting for Companies',
            chapters: [
              'Accounting for Share Capital',
              'Issue and Redemption of Debentures'
            ]
          },
          {
            unitName: 'Unit 3: Analysis of Financial Statements',
            chapters: [
              'Financial Statements of a Company',
              'Accounting Ratios',
              'Cash Flow Statement'
            ]
          }
        ],
        chapters: [
          'Fundamentals of Partnership',
          'Goodwill: Nature and Valuation',
          'Admission of a Partner',
          'Retirement and Death of a Partner',
          'Dissolution of Partnership Firm',
          'Accounting for Share Capital',
          'Issue and Redemption of Debentures',
          'Financial Statements of a Company',
          'Accounting Ratios',
          'Cash Flow Statement'
        ]
      },
      {
        id: 'c12_bst',
        name: 'Business Studies',
        description: 'Principles of Management, Business Environment & Marketing',
        iconName: 'Briefcase',
        units: [
          {
            unitName: 'Unit 1-3: Foundations of Management & Environment',
            chapters: [
              'Nature and Significance of Management',
              'Principles of Management',
              'Business Environment'
            ]
          },
          {
            unitName: 'Unit 4-8: Management Functions (POLCA)',
            chapters: [
              'Planning',
              'Organising',
              'Staffing',
              'Directing',
              'Controlling'
            ]
          },
          {
            unitName: 'Unit 9-12: Business Finance & Marketing',
            chapters: [
              'Financial Management',
              'Financial Markets',
              'Marketing Management',
              'Consumer Protection'
            ]
          }
        ],
        chapters: [
          'Nature and Significance of Management',
          'Principles of Management',
          'Business Environment',
          'Planning',
          'Organising',
          'Staffing',
          'Directing',
          'Controlling',
          'Financial Management',
          'Financial Markets',
          'Marketing Management',
          'Consumer Protection'
        ]
      },
      {
        id: 'c12_economics',
        name: 'Economics',
        description: 'Macroeconomics & Indian Economic Development',
        iconName: 'TrendingUp',
        units: [
          {
            unitName: 'Unit 1: National Income & Related Aggregates',
            chapters: [
              'National Income and Related Aggregates'
            ]
          },
          {
            unitName: 'Unit 2: Money and Banking',
            chapters: [
              'Money and Banking'
            ]
          },
          {
            unitName: 'Unit 3: Determination of Income & Employment',
            chapters: [
              'Determination of Income and Employment'
            ]
          },
          {
            unitName: 'Unit 4: Government Budget and the Economy',
            chapters: [
              'Government Budget and the Economy'
            ]
          },
          {
            unitName: 'Unit 5: Balance of Payments & Foreign Exchange',
            chapters: [
              'Balance of Payments & Foreign Exchange'
            ]
          },
          {
            unitName: 'Unit 6: Development Experience (1947-90) & Economic Reforms (LPG)',
            chapters: [
              'Indian Economy on the Eve of Independence',
              'Indian Economy (1950 - 1990)',
              'Economic Reforms Since 1991 (LPG)'
            ]
          },
          {
            unitName: 'Unit 7: Current Challenges Facing Indian Economy',
            chapters: [
              'Human Capital Formation in India',
              'Rural Development: Credit & Marketing',
              'Employment: Growth, Informalisation & Other Issues',
              'Environment and Sustainable Economic Development'
            ]
          },
          {
            unitName: 'Unit 8: Comparative Development Experiences (India & Neighbours)',
            chapters: [
              'Comparative Development Experiences of India and its Neighbours'
            ]
          }
        ],
        chapters: [
          'National Income and Related Aggregates',
          'Money and Banking',
          'Determination of Income and Employment',
          'Government Budget and the Economy',
          'Balance of Payments & Foreign Exchange',
          'Indian Economy on the Eve of Independence',
          'Indian Economy (1950 - 1990)',
          'Economic Reforms Since 1991 (LPG)',
          'Human Capital Formation in India',
          'Rural Development: Credit & Marketing',
          'Employment: Growth, Informalisation & Other Issues',
          'Environment and Sustainable Economic Development',
          'Comparative Development Experiences of India and its Neighbours'
        ]
      },
      {
        id: 'c12_english',
        name: 'English Core',
        description: 'Reading Comprehension, Advanced Writing & Flamingo/Vistas Literature',
        iconName: 'BookOpen',
        chapters: [
          'Reading Comprehension & Note Making',
          'Creative Writing: Notice, Invitation & Replies',
          'Letters to Editor & Job Applications',
          'Articles & Report Writing',
          'Flamingo: The Last Lesson & Lost Spring',
          'Flamingo: Deep Water & The Rattrap',
          'Flamingo Poetry: My Mother at Sixty-Six & Keeping Quiet',
          'Vistas: The Third Level & The Tiger King',
          'Vistas: Journey to the End of the Earth & On the Face of It'
        ]
      },
      {
        id: 'c12_maths',
        name: 'Mathematics',
        code: '041',
        description: 'Relations, Calculus (Integrals, Derivatives, Differential Equations), Vectors, 3D Geometry, Matrices & Probability',
        iconName: 'Calculator',
        chapters: [
          'Relations and Functions',
          'Inverse Trigonometric Functions',
          'Matrices',
          'Determinants',
          'Continuity and Differentiability',
          'Application of Derivatives (AOD)',
          'Integrals (Definite & Indefinite)',
          'Application of the Integrals (Area under Curves)',
          'Differential Equations',
          'Vector Algebra',
          'Three Dimensional Geometry (3D)',
          'Linear Programming (LPP)',
          'Probability (Bayes Theorem & Distributions)'
        ]
      },
      {
        id: 'c12_pe',
        name: 'Physical Education',
        description: 'Sports Management, Nutrition, Biomechanics & Injury Rehabilitation',
        iconName: 'Activity',
        chapters: [
          'Management of Sporting Events (Fixtures & Tournaments)',
          'Children & Women in Sports',
          'Yoga as Preventive Measure for Lifestyle Disease',
          'Physical Education & Sports for CWSN',
          'Sports & Nutrition (Balanced Diet & Nutrients)',
          'Test & Measurement in Sports (SAIK & Rikli Jones)',
          'Physiology & Injuries in Sports (First Aid & Recovery)',
          'Biomechanics & Sports (Newton Laws, Equilibrium)',
          'Psychology & Sports (Personality, Motivation, Aggression)',
          'Training in Sports (Strength, Endurance, Speed, Flexibility)'
        ]
      }
    ]
  },

  CLASS_12_SCIENCE: {
    id: 'CLASS_12_SCIENCE',
    title: 'Class 12 Science (PCM / PCB)',
    subtitle: 'Senior Secondary CBSE Board & State Syllabus (Rationalized Pattern)',
    badge: 'Class 12 Science',
    defaultLevel: 'Class 12 CBSE (Science)',
    subjects: [
      {
        id: 'c12sci_physics',
        name: 'Physics',
        code: '042',
        description: 'Electrostatics, Magnetism, Optics, Modern Physics & Semiconductor Electronics',
        iconName: 'Zap',
        units: [
          {
            unitName: 'Unit 1: Electrostatics',
            chapters: [
              'Electric Charges and Fields (Coulomb\'s Law, Gauss\'s Theorem & Applications)',
              'Electrostatic Potential and Capacitance (Equipotential Surfaces, Dielectrics & Energy Stored)'
            ]
          },
          {
            unitName: 'Unit 2: Current Electricity',
            chapters: [
              'Current Electricity (Drift Velocity, Ohm\'s Law, Kirchhoff\'s Laws & Wheatstone Bridge)'
            ]
          },
          {
            unitName: 'Unit 3: Magnetic Effects of Current and Magnetism',
            chapters: [
              'Moving Charges and Magnetism (Biot-Savart Law, Ampere\'s Circuital Law & Solenoid)',
              'Magnetism and Matter (Magnetic Dipole, Earth\'s Magnetic Field & Hysteresis)'
            ]
          },
          {
            unitName: 'Unit 4: Electromagnetic Induction and Alternating Currents',
            chapters: [
              'Electromagnetic Induction (Faraday\'s & Lenz\'s Law, Self and Mutual Inductance)',
              'Alternating Currents (LCR Series Circuit, Resonance, Power Factor & AC Generator/Transformer)'
            ]
          },
          {
            unitName: 'Unit 5: Electromagnetic Waves',
            chapters: [
              'Electromagnetic Waves (Displacement Current, EM Spectrum Characteristics & Uses)'
            ]
          },
          {
            unitName: 'Unit 6: Optics',
            chapters: [
              'Ray Optics and Optical Instruments (Refraction at Spherical Surfaces, Lens Maker\'s Formula, Prism, Microscopes & Telescopes)',
              'Wave Optics (Huygens\' Principle, Young\'s Double Slit Interference, Single Slit Diffraction)'
            ]
          },
          {
            unitName: 'Unit 7: Dual Nature of Radiation and Matter',
            chapters: [
              'Dual Nature of Radiation and Matter (Photoelectric Effect, Einstein\'s Equation & de Broglie Wavelength)'
            ]
          },
          {
            unitName: 'Unit 8: Atoms and Nuclei',
            chapters: [
              'Atoms (Alpha Particle Scattering, Bohr Model of Hydrogen Atom & Energy Levels)',
              'Nuclei (Mass Defect, Binding Energy per Nucleon, Nuclear Fission & Fusion)'
            ]
          },
          {
            unitName: 'Unit 9: Electronic Devices',
            chapters: [
              'Semiconductor Electronics: Materials, Devices and Simple Circuits (p-n Junction Diode, Rectifier & I-V Characteristics)'
            ]
          }
        ],
        chapters: [
          'Electric Charges and Fields (Coulomb\'s Law, Gauss\'s Theorem & Applications)',
          'Electrostatic Potential and Capacitance (Equipotential Surfaces, Dielectrics & Energy Stored)',
          'Current Electricity (Drift Velocity, Ohm\'s Law, Kirchhoff\'s Laws & Wheatstone Bridge)',
          'Moving Charges and Magnetism (Biot-Savart Law, Ampere\'s Circuital Law & Solenoid)',
          'Magnetism and Matter (Magnetic Dipole, Earth\'s Magnetic Field & Hysteresis)',
          'Electromagnetic Induction (Faraday\'s & Lenz\'s Law, Self and Mutual Inductance)',
          'Alternating Currents (LCR Series Circuit, Resonance, Power Factor & AC Generator/Transformer)',
          'Electromagnetic Waves (Displacement Current, EM Spectrum Characteristics & Uses)',
          'Ray Optics and Optical Instruments (Refraction at Spherical Surfaces, Lens Maker\'s Formula, Prism, Microscopes & Telescopes)',
          'Wave Optics (Huygens\' Principle, Young\'s Double Slit Interference, Single Slit Diffraction)',
          'Dual Nature of Radiation and Matter (Photoelectric Effect, Einstein\'s Equation & de Broglie Wavelength)',
          'Atoms (Alpha Particle Scattering, Bohr Model of Hydrogen Atom & Energy Levels)',
          'Nuclei (Mass Defect, Binding Energy per Nucleon, Nuclear Fission & Fusion)',
          'Semiconductor Electronics: Materials, Devices and Simple Circuits (p-n Junction Diode, Rectifier & I-V Characteristics)'
        ]
      },
      {
        id: 'c12sci_chemistry',
        name: 'Chemistry',
        code: '043',
        description: 'Physical Chemistry, Inorganic Coordination, d/f Block & Organic Reaction Mechanisms',
        iconName: 'FlaskConical',
        units: [
          {
            unitName: 'Unit 1: Solutions',
            chapters: [
              'Solutions (Raoult\'s Law, Colligative Properties, Osmotic Pressure & Van\'t Hoff Factor)'
            ]
          },
          {
            unitName: 'Unit 2: Electrochemistry',
            chapters: [
              'Electrochemistry (Nernst Equation, Kohlrausch\'s Law, Conductance, Fuel Cells & Corrosion)'
            ]
          },
          {
            unitName: 'Unit 3: Chemical Kinetics',
            chapters: [
              'Chemical Kinetics (Rate of Reaction, Order, Molecularity, Integrated Rate Equations & Arrhenius Equation)'
            ]
          },
          {
            unitName: 'Unit 4: d- and f-Block Elements',
            chapters: [
              'The d- and f-Block Elements (Transition Elements, Lanthanoid Contraction, KMnO4 & K2Cr2O7 Properties)'
            ]
          },
          {
            unitName: 'Unit 5: Coordination Compounds',
            chapters: [
              'Coordination Compounds (Werner\'s Theory, IUPAC Nomenclature, Isomerism, CFT & VBT)'
            ]
          },
          {
            unitName: 'Unit 6: Haloalkanes and Haloarenes',
            chapters: [
              'Haloalkanes and Haloarenes (SN1 & SN2 Mechanisms, Chirality, Polyhalogen Compounds)'
            ]
          },
          {
            unitName: 'Unit 7: Alcohols, Phenols and Ethers',
            chapters: [
              'Alcohols, Phenols and Ethers (Acidity of Phenols, Kolbe\'s Reaction, Reimer-Tiemann & Williamson Synthesis)'
            ]
          },
          {
            unitName: 'Unit 8: Aldehydes, Ketones and Carboxylic Acids',
            chapters: [
              'Aldehydes, Ketones and Carboxylic Acids (Nucleophilic Addition, Aldol Condensation, Cannizzaro Reaction & HVZ Reaction)'
            ]
          },
          {
            unitName: 'Unit 9: Amines',
            chapters: [
              'Amines (Basicity of Amines, Gabriel Phthalimide, Hoffmann Bromamide & Diazonium Salt Reactions)'
            ]
          },
          {
            unitName: 'Unit 10: Biomolecules',
            chapters: [
              'Biomolecules (Glucose, Fructose, Peptide Bond, Denaturation of Proteins, DNA/RNA Structure)'
            ]
          }
        ],
        chapters: [
          'Solutions (Raoult\'s Law, Colligative Properties, Osmotic Pressure & Van\'t Hoff Factor)',
          'Electrochemistry (Nernst Equation, Kohlrausch\'s Law, Conductance, Fuel Cells & Corrosion)',
          'Chemical Kinetics (Rate of Reaction, Order, Molecularity, Integrated Rate Equations & Arrhenius Equation)',
          'The d- and f-Block Elements (Transition Elements, Lanthanoid Contraction, KMnO4 & K2Cr2O7 Properties)',
          'Coordination Compounds (Werner\'s Theory, IUPAC Nomenclature, Isomerism, CFT & VBT)',
          'Haloalkanes and Haloarenes (SN1 & SN2 Mechanisms, Chirality, Polyhalogen Compounds)',
          'Alcohols, Phenols and Ethers (Acidity of Phenols, Kolbe\'s Reaction, Reimer-Tiemann & Williamson Synthesis)',
          'Aldehydes, Ketones and Carboxylic Acids (Nucleophilic Addition, Aldol Condensation, Cannizzaro Reaction & HVZ Reaction)',
          'Amines (Basicity of Amines, Gabriel Phthalimide, Hoffmann Bromamide & Diazonium Salt Reactions)',
          'Biomolecules (Glucose, Fructose, Peptide Bond, Denaturation of Proteins, DNA/RNA Structure)'
        ]
      },
      {
        id: 'c12sci_mathematics',
        name: 'Mathematics',
        code: '041',
        description: 'Calculus (Integrals & Derivatives), Vectors, 3D Geometry, Matrices & Probability',
        iconName: 'Calculator',
        units: [
          {
            unitName: 'Unit 1: Relations and Functions',
            chapters: [
              'Relations and Functions (Equivalence Relations, One-One & Onto Functions)',
              'Inverse Trigonometric Functions (Principal Value Branches & Graphs)'
            ]
          },
          {
            unitName: 'Unit 2: Algebra',
            chapters: [
              'Matrices (Matrix Operations, Transpose, Symmetric/Skew-Symmetric & Invertible Matrices)',
              'Determinants (Minors, Cofactors, Adjoint, Inverse of Matrix & System of Linear Equations)'
            ]
          },
          {
            unitName: 'Unit 3: Calculus',
            chapters: [
              'Continuity and Differentiability (Chain Rule, Derivatives of Implicit Functions & Logarithmic Diff)',
              'Application of Derivatives (Rate of Change, Increasing/Decreasing Functions, Maxima and Minima)',
              'Integrals (Definite & Indefinite Integration, Substitution, Partial Fractions & Parts)',
              'Application of the Integrals (Area Under Simple Curves & Lines)',
              'Differential Equations (Order, Degree, General/Particular Solutions & Homogeneous/Linear DEs)'
            ]
          },
          {
            unitName: 'Unit 4: Vectors and 3D Geometry',
            chapters: [
              'Vector Algebra (Dot and Cross Product of Vectors, Projection of a Vector)',
              'Three Dimensional Geometry (Direction Cosines, Equation of Lines & Shortest Distance between Skew Lines)'
            ]
          },
          {
            unitName: 'Unit 5: Linear Programming',
            chapters: [
              'Linear Programming (Mathematical Formulation, Graphical Feasible Region & Corner Point Method)'
            ]
          },
          {
            unitName: 'Unit 6: Probability',
            chapters: [
              'Probability (Conditional Probability, Multiplication Theorem, Independent Events & Bayes\' Theorem)'
            ]
          }
        ],
        chapters: [
          'Relations and Functions (Equivalence Relations, One-One & Onto Functions)',
          'Inverse Trigonometric Functions (Principal Value Branches & Graphs)',
          'Matrices (Matrix Operations, Transpose, Symmetric/Skew-Symmetric & Invertible Matrices)',
          'Determinants (Minors, Cofactors, Adjoint, Inverse of Matrix & System of Linear Equations)',
          'Continuity and Differentiability (Chain Rule, Derivatives of Implicit Functions & Logarithmic Diff)',
          'Application of Derivatives (Rate of Change, Increasing/Decreasing Functions, Maxima and Minima)',
          'Integrals (Definite & Indefinite Integration, Substitution, Partial Fractions & Parts)',
          'Application of the Integrals (Area Under Simple Curves & Lines)',
          'Differential Equations (Order, Degree, General/Particular Solutions & Homogeneous/Linear DEs)',
          'Vector Algebra (Dot and Cross Product of Vectors, Projection of a Vector)',
          'Three Dimensional Geometry (Direction Cosines, Equation of Lines & Shortest Distance between Skew Lines)',
          'Linear Programming (Mathematical Formulation, Graphical Feasible Region & Corner Point Method)',
          'Probability (Conditional Probability, Multiplication Theorem, Independent Events & Bayes\' Theorem)'
        ]
      },
      {
        id: 'c12sci_biology',
        name: 'Biology',
        code: '044',
        description: 'Genetics, Molecular Basis, Biotechnology, Human Health & Reproduction',
        iconName: 'HeartPulse',
        units: [
          {
            unitName: 'Unit 1: Reproduction',
            chapters: [
              'Sexual Reproduction in Flowering Plants (Micro/Megasporogenesis, Pollination & Double Fertilization)',
              'Human Reproduction (Male/Female Reproductive Systems, Spermatogenesis, Oogenesis & Menstrual Cycle)',
              'Reproductive Health (Contraception, Medical Termination of Pregnancy & Assisted Reproductive Tech)'
            ]
          },
          {
            unitName: 'Unit 2: Genetics and Evolution',
            chapters: [
              'Principles of Inheritance and Variation (Mendelian Laws, Sex Determination, Linkage & Genetic Disorders)',
              'Molecular Basis of Inheritance (DNA Structure, Replication, Transcription, Genetic Code, Translation & Lac Operon)',
              'Evolution (Origin of Life, Darwinian Evidence, Natural Selection, Adaptive Radiation & Hardy-Weinberg)'
            ]
          },
          {
            unitName: 'Unit 3: Biology in Human Welfare',
            chapters: [
              'Human Health and Diseases (Infectious Diseases, Immunity, AIDS, Cancer & Drug Abuse)',
              'Microbes in Human Welfare (Household Food, Industrial Fermentation, Sewage Treatment & Biogas)'
            ]
          },
          {
            unitName: 'Unit 4: Biotechnology',
            chapters: [
              'Biotechnology: Principles and Processes (Restriction Enzymes, Cloning Vectors & PCR Amplification)',
              'Biotechnology and its Applications (Bt Crops, RNA Interference, Genetically Engineered Insulin & Gene Therapy)'
            ]
          },
          {
            unitName: 'Unit 5: Ecology and Environment',
            chapters: [
              'Organisms and Populations (Population Attributes, Growth Curves & Population Interactions)',
              'Ecosystem (Productivity, Decomposition, Energy Flow & Ecological Pyramids)',
              'Biodiversity and Conservation (Patterns of Biodiversity, Loss of Biodiversity & Conservation Strategies)'
            ]
          }
        ],
        chapters: [
          'Sexual Reproduction in Flowering Plants (Micro/Megasporogenesis, Pollination & Double Fertilization)',
          'Human Reproduction (Male/Female Reproductive Systems, Spermatogenesis, Oogenesis & Menstrual Cycle)',
          'Reproductive Health (Contraception, Medical Termination of Pregnancy & Assisted Reproductive Tech)',
          'Principles of Inheritance and Variation (Mendelian Laws, Sex Determination, Linkage & Genetic Disorders)',
          'Molecular Basis of Inheritance (DNA Structure, Replication, Transcription, Genetic Code, Translation & Lac Operon)',
          'Evolution (Origin of Life, Darwinian Evidence, Natural Selection, Adaptive Radiation & Hardy-Weinberg)',
          'Human Health and Diseases (Infectious Diseases, Immunity, AIDS, Cancer & Drug Abuse)',
          'Microbes in Human Welfare (Household Food, Industrial Fermentation, Sewage Treatment & Biogas)',
          'Biotechnology: Principles and Processes (Restriction Enzymes, Cloning Vectors & PCR Amplification)',
          'Biotechnology and its Applications (Bt Crops, RNA Interference, Genetically Engineered Insulin & Gene Therapy)',
          'Organisms and Populations (Population Attributes, Growth Curves & Population Interactions)',
          'Ecosystem (Productivity, Decomposition, Energy Flow & Ecological Pyramids)',
          'Biodiversity and Conservation (Patterns of Biodiversity, Loss of Biodiversity & Conservation Strategies)'
        ]
      },
      {
        id: 'c12sci_cs',
        name: 'Computer Science',
        code: '083',
        description: 'Python Programming, Data Structures (Stacks), Computer Networks & Relational SQL',
        iconName: 'Cpu',
        units: [
          {
            unitName: 'Unit 1: Computational Thinking & Programming',
            chapters: [
              'Python Functions (Parameters, Return Values, Scope of Variables)',
              'File Handling in Python (Text Files, Binary Files via Pickle, CSV Files)',
              'Data Structures: Stacks using Python Lists (Push, Pop, Peek Operations)'
            ]
          },
          {
            unitName: 'Unit 2: Computer Networks',
            chapters: [
              'Evolution of Networking, Topologies, Transmission Media & Network Devices',
              'Network Protocols (TCP/IP, HTTP, HTTPS, FTP, DNS) and Cyber Security Basics'
            ]
          },
          {
            unitName: 'Unit 3: Database Management & SQL',
            chapters: [
              'Relational Database Concepts, Keys & SQL DDL/DML Commands',
              'SQL Aggregate Functions, Group By, Having, Table Joins & Python-MySQL Connector'
            ]
          }
        ],
        chapters: [
          'Python Functions (Parameters, Return Values, Scope of Variables)',
          'File Handling in Python (Text Files, Binary Files via Pickle, CSV Files)',
          'Data Structures: Stacks using Python Lists (Push, Pop, Peek Operations)',
          'Evolution of Networking, Topologies, Transmission Media & Network Devices',
          'Network Protocols (TCP/IP, HTTP, HTTPS, FTP, DNS) and Cyber Security Basics',
          'Relational Database Concepts, Keys & SQL DDL/DML Commands',
          'SQL Aggregate Functions, Group By, Having, Table Joins & Python-MySQL Connector'
        ]
      },
      {
        id: 'c12sci_english',
        name: 'English Core',
        code: '301',
        description: 'Reading Comprehension, Advanced Creative Writing & Literature (Flamingo / Vistas)',
        iconName: 'BookOpen',
        chapters: [
          'Reading Comprehension: Discursive & Case-Based Factual Passages',
          'Creative Writing: Notice Writing & Formal/Informal Invitations',
          'Creative Writing: Letters to Editor & Job Applications with Bio-data',
          'Creative Writing: Article & Report Writing',
          'Flamingo Prose: The Last Lesson, Lost Spring, Deep Water & The Rattrap',
          'Flamingo Prose: Indigo, Poets and Pancakes, The Interview & Going Places',
          'Flamingo Poetry: My Mother at Sixty-Six, Keeping Quiet & A Thing of Beauty',
          'Flamingo Poetry: A Roadside Stand & Aunt Jennifer\'s Tigers',
          'Vistas: The Third Level, The Tiger King & Journey to the End of the Earth',
          'Vistas: The Enemy, On the Face of It & Memories of Childhood'
        ]
      }
    ]
  },

  CLASS_12_ARTS: {
    id: 'CLASS_12_ARTS',
    title: 'Class 12 Arts / Humanities',
    subtitle: 'Senior Secondary CBSE Board & State Syllabus (Rationalized Pattern)',
    badge: 'Class 12 Arts',
    defaultLevel: 'Class 12 CBSE (Humanities)',
    subjects: [
      {
        id: 'c12arts_history',
        name: 'History',
        code: '027',
        description: 'Themes in Indian History Parts 1, 2, 3 (Ancient, Medieval & Modern Indian Historiography)',
        iconName: 'Landmark',
        units: [
          {
            unitName: 'Part 1: Archaeology & Ancient India (Themes 1-4)',
            chapters: [
              'Bricks, Beads and Bones (The Harappan Civilisation - Town Planning & Artefacts)',
              'Kings, Farmers and Towns (Early States & Economies c. 600 BCE - 600 CE, Inscriptions & Mauryan Empire)',
              'Kinship, Caste and Class (Early Societies c. 600 BCE - 600 CE, Mahabharata & Social Norms)',
              'Thinkers, Beliefs and Buildings (Cultural Developments c. 600 BCE - 600 CE, Sanchi Stupa, Buddhism & Jainism)'
            ]
          },
          {
            unitName: 'Part 2: Medieval India & Cultural Synthesis (Themes 5-8)',
            chapters: [
              'Through the Eyes of Travellers (Perceptions of Society: Al-Biruni, Ibn Battuta & François Bernier)',
              'Bhakti-Sufi Traditions (Changes in Religious Beliefs, Saguna/Nirguna, Alvars, Nayanars, Sufi Silsilas & Devotional Texts)',
              'An Imperial Capital: Vijayanagara (Architecture, Water Resources, Sacred Centre & Royal Centre)',
              'Peasants, Zamindars and the State (Agrarian Society, Ain-i-Akbari, Land Revenue & Village Communities)'
            ]
          },
          {
            unitName: 'Part 3: Modern India & Constitution (Themes 9-12)',
            chapters: [
              'Colonialism and the Countryside (Exploring Official Archives, Permanent Settlement, Ryotwari & Deccan Riots)',
              'Rebels and the Raj (1857 Revolt: Causes, Leadership, Spread, Rumours & Visual Representations)',
              'Mahatma Gandhi and the Nationalist Movement (Non-Cooperation, Salt Satyagraha, Quit India & Mass Mobilisation)',
              'Framing the Constitution (The Constituent Assembly Debates, Ideals, Language Controversy & Federalism)'
            ]
          }
        ],
        chapters: [
          'Bricks, Beads and Bones (The Harappan Civilisation - Town Planning & Artefacts)',
          'Kings, Farmers and Towns (Early States & Economies c. 600 BCE - 600 CE, Inscriptions & Mauryan Empire)',
          'Kinship, Caste and Class (Early Societies c. 600 BCE - 600 CE, Mahabharata & Social Norms)',
          'Thinkers, Beliefs and Buildings (Cultural Developments c. 600 BCE - 600 CE, Sanchi Stupa, Buddhism & Jainism)',
          'Through the Eyes of Travellers (Perceptions of Society: Al-Biruni, Ibn Battuta & François Bernier)',
          'Bhakti-Sufi Traditions (Changes in Religious Beliefs, Saguna/Nirguna, Alvars, Nayanars, Sufi Silsilas & Devotional Texts)',
          'An Imperial Capital: Vijayanagara (Architecture, Water Resources, Sacred Centre & Royal Centre)',
          'Peasants, Zamindars and the State (Agrarian Society, Ain-i-Akbari, Land Revenue & Village Communities)',
          'Colonialism and the Countryside (Exploring Official Archives, Permanent Settlement, Ryotwari & Deccan Riots)',
          'Rebels and the Raj (1857 Revolt: Causes, Leadership, Spread, Rumours & Visual Representations)',
          'Mahatma Gandhi and the Nationalist Movement (Non-Cooperation, Salt Satyagraha, Quit India & Mass Mobilisation)',
          'Framing the Constitution (The Constituent Assembly Debates, Ideals, Language Controversy & Federalism)'
        ]
      },
      {
        id: 'c12arts_polsci',
        name: 'Political Science',
        code: '028',
        description: 'Contemporary World Politics & Politics in India Since Independence (Updated CBSE Framework)',
        iconName: 'Shield',
        units: [
          {
            unitName: 'Part A: Contemporary World Politics',
            chapters: [
              'The End of Bipolarity (Soviet Disintegration, Shock Therapy, Gulf War & Democratic Transitions)',
              'Contemporary Centres of Power (European Union, ASEAN, BRICS, China, Japan & South Korea)',
              'Contemporary South Asia (Democratisation & Conflicts: Pakistan, Bangladesh, Nepal, Sri Lanka, Maldives & SAARC)',
              'International Organizations (UN System, Security Council Reforms, Principal Organs, UNESCO, UNICEF, WHO & WTO)',
              'Security in the Contemporary World (Traditional/Non-Traditional Security, Global Terrorism, Human Security & Pandemics)',
              'Environment and Natural Resources (Global Commons, Kyoto Protocol, Paris Climate Accord & Resource Geopolitics)',
              'Globalisation (Economic, Political, Cultural Dimensions, Advocates vs Critics & Anti-Globalisation Movements)'
            ]
          },
          {
            unitName: 'Part B: Politics in India Since Independence',
            chapters: [
              'Challenges of Nation Building (Partition Traumas, Integration of Princely States & States Reorganisation Act 1956)',
              'Era of One-Party Dominance (First General Elections 1952, Congress System Nature & Emergence of Opposition)',
              'Politics of Planned Development (Planning Commission to NITI Aayog, Five Year Plans & Green Revolution)',
              'India\'s External Relations (Non-Alignment Policy, Sino-Indian War 1962, Indo-Pak Wars 1965/1971 & Nuclear Stance)',
              'Challenges to and Restoration of the Congress System (1967 Political Earthquake, 1969 Split, Syndicate vs Indira, 1971 Garibi Hatao)',
              'The Crisis of Democratic Order (JP Movement, Railway Strike, Declaration of National Emergency 1975, Lessons & 1977 Elections)',
              'Regional Aspirations (Jammu & Kashmir Issue, Punjab Accord, North-East Peace Accords & Autonomy Movements)',
              'Recent Developments in Indian Politics (Era of Coalitions, Mandal Commission, Economic Reforms & Contemporary Governance)'
            ]
          }
        ],
        chapters: [
          'The End of Bipolarity (Soviet Disintegration, Shock Therapy, Gulf War & Democratic Transitions)',
          'Contemporary Centres of Power (European Union, ASEAN, BRICS, China, Japan & South Korea)',
          'Contemporary South Asia (Democratisation & Conflicts: Pakistan, Bangladesh, Nepal, Sri Lanka, Maldives & SAARC)',
          'International Organizations (UN System, Security Council Reforms, Principal Organs, UNESCO, UNICEF, WHO & WTO)',
          'Security in the Contemporary World (Traditional/Non-Traditional Security, Global Terrorism, Human Security & Pandemics)',
          'Environment and Natural Resources (Global Commons, Kyoto Protocol, Paris Climate Accord & Resource Geopolitics)',
          'Globalisation (Economic, Political, Cultural Dimensions, Advocates vs Critics & Anti-Globalisation Movements)',
          'Challenges of Nation Building (Partition Traumas, Integration of Princely States & States Reorganisation Act 1956)',
          'Era of One-Party Dominance (First General Elections 1952, Congress System Nature & Emergence of Opposition)',
          'Politics of Planned Development (Planning Commission to NITI Aayog, Five Year Plans & Green Revolution)',
          'India\'s External Relations (Non-Alignment Policy, Sino-Indian War 1962, Indo-Pak Wars 1965/1971 & Nuclear Stance)',
          'Challenges to and Restoration of the Congress System (1967 Political Earthquake, 1969 Split, Syndicate vs Indira, 1971 Garibi Hatao)',
          'The Crisis of Democratic Order (JP Movement, Railway Strike, Declaration of National Emergency 1975, Lessons & 1977 Elections)',
          'Regional Aspirations (Jammu & Kashmir Issue, Punjab Accord, North-East Peace Accords & Autonomy Movements)',
          'Recent Developments in Indian Politics (Era of Coalitions, Mandal Commission, Economic Reforms & Contemporary Governance)'
        ]
      },
      {
        id: 'c12arts_geography',
        name: 'Geography',
        code: '029',
        description: 'Fundamentals of Human Geography & India: People and Economy (CBSE Rationalized Syllabus)',
        iconName: 'Compass',
        units: [
          {
            unitName: 'Book 1: Fundamentals of Human Geography',
            chapters: [
              'Human Geography: Nature, Scope and Core Paradigms',
              'The World Population: Distribution, Density, Growth & Demographic Transition Model',
              'Human Development (Concepts, HDI Indicators, Approaches & International Comparisons)',
              'Primary Activities (Hunting, Gathering, Pastoralism, Subsistence/Commercial Agriculture & Mining)',
              'Secondary Activities (Manufacturing Industry Classification, Location Factors & High-Tech Industry)',
              'Tertiary and Quaternary Activities (Trade, Transport, Communication, Services, Tourism & Medical Tourism)',
              'Transport, Communication and Trade (Land, Waterways, Major Canals, Trans-Continental Railways & Air Routes)',
              'International Trade (Basis of International Trade, Balance of Trade & World Ports as Gateways)'
            ]
          },
          {
            unitName: 'Book 2: India - People and Economy',
            chapters: [
              'Population: Distribution, Density, Growth and Linguistic/Religious Composition in India',
              'Human Settlements (Rural Settlement Types, Urbanisation Trends & Functional Classification of Indian Towns)',
              'Land Resources and Agriculture (Land-use Changes, Major Food & Cash Crops, Agricultural Challenges)',
              'Water Resources (Surface & Groundwater Availability, Watershed Management & Rainwater Harvesting Schemes)',
              'Mineral and Energy Resources (Metallic & Non-Metallic Minerals, Conventional & Non-Conventional Renewable Energy)',
              'Planning and Sustainable Development in Indian Context (Target Area Programmes & Case Studies)',
              'Transport and Communication in India (National Highway Network, Dedicated Freight Corridors & Pipelines)',
              'International Trade of India (Changing Commodity Composition of Exports/Imports & Major Seaports)',
              'Geographical Perspective on Selected Issues and Problems (Water/Air/Noise Pollution, Urban Slums & Land Degradation)'
            ]
          }
        ],
        chapters: [
          'Human Geography: Nature, Scope and Core Paradigms',
          'The World Population: Distribution, Density, Growth & Demographic Transition Model',
          'Human Development (Concepts, HDI Indicators, Approaches & International Comparisons)',
          'Primary Activities (Hunting, Gathering, Pastoralism, Subsistence/Commercial Agriculture & Mining)',
          'Secondary Activities (Manufacturing Industry Classification, Location Factors & High-Tech Industry)',
          'Tertiary and Quaternary Activities (Trade, Transport, Communication, Services, Tourism & Medical Tourism)',
          'Transport, Communication and Trade (Land, Waterways, Major Canals, Trans-Continental Railways & Air Routes)',
          'International Trade (Basis of International Trade, Balance of Trade & World Ports as Gateways)',
          'Population: Distribution, Density, Growth and Linguistic/Religious Composition in India',
          'Human Settlements (Rural Settlement Types, Urbanisation Trends & Functional Classification of Indian Towns)',
          'Land Resources and Agriculture (Land-use Changes, Major Food & Cash Crops, Agricultural Challenges)',
          'Water Resources (Surface & Groundwater Availability, Watershed Management & Rainwater Harvesting Schemes)',
          'Mineral and Energy Resources (Metallic & Non-Metallic Minerals, Conventional & Non-Conventional Renewable Energy)',
          'Planning and Sustainable Development in Indian Context (Target Area Programmes & Case Studies)',
          'Transport and Communication in India (National Highway Network, Dedicated Freight Corridors & Pipelines)',
          'International Trade of India (Changing Commodity Composition of Exports/Imports & Major Seaports)',
          'Geographical Perspective on Selected Issues and Problems (Water/Air/Noise Pollution, Urban Slums & Land Degradation)'
        ]
      },
      {
        id: 'c12arts_sociology',
        name: 'Sociology',
        code: '039',
        description: 'Indian Society & Social Change and Development in India (Structural & Cultural Transformations)',
        iconName: 'Users',
        units: [
          {
            unitName: 'Book 1: Indian Society',
            chapters: [
              'Introducing Indian Society (Colonialism, Nationalism & Sociological Imagination)',
              'The Demographic Structure of Indian Society (Malthusian Theory, Age Structure, Demographic Dividend & Sex Ratio)',
              'Social Institutions: Continuity and Change (Caste System, Varna vs Jati, Tribe Classifications, Joint Family & Kinship)',
              'Patterns of Social Inequality and Exclusion (Untouchability, Dalits, Adivasis, OBCs, Women & Differently Abled Struggles)',
              'The Challenges of Cultural Diversity (Pluralism, Communalism, Secularism, Regionalism & The Nation-State)'
            ]
          },
          {
            unitName: 'Book 2: Social Change and Development in India',
            chapters: [
              'Structural Change (Colonial Impact, Industrialisation, Urbanisation & Capitalist Development)',
              'Cultural Change (Sanskritisation, Modernisation, Westernisation, Secularisation & Commercialisation)',
              'Change and Development in Rural Society (Agrarian Structure, Land Ceiling Reforms, Green Revolution & Contract Farming)',
              'Change and Development in Industrial Society (Organised vs Unorganised Sector, Working Conditions & Automation)',
              'Social Movements (Theories of Social Movements, Peasants, Workers, Dalit, Tribal, Women\'s & Environmental Movements)'
            ]
          }
        ],
        chapters: [
          'Introducing Indian Society (Colonialism, Nationalism & Sociological Imagination)',
          'The Demographic Structure of Indian Society (Malthusian Theory, Age Structure, Demographic Dividend & Sex Ratio)',
          'Social Institutions: Continuity and Change (Caste System, Varna vs Jati, Tribe Classifications, Joint Family & Kinship)',
          'Patterns of Social Inequality and Exclusion (Untouchability, Dalits, Adivasis, OBCs, Women & Differently Abled Struggles)',
          'The Challenges of Cultural Diversity (Pluralism, Communalism, Secularism, Regionalism & The Nation-State)',
          'Structural Change (Colonial Impact, Industrialisation, Urbanisation & Capitalist Development)',
          'Cultural Change (Sanskritisation, Modernisation, Westernisation, Secularisation & Commercialisation)',
          'Change and Development in Rural Society (Agrarian Structure, Land Ceiling Reforms, Green Revolution & Contract Farming)',
          'Change and Development in Industrial Society (Organised vs Unorganised Sector, Working Conditions & Automation)',
          'Social Movements (Theories of Social Movements, Peasants, Workers, Dalit, Tribal, Women\'s & Environmental Movements)'
        ]
      },
      {
        id: 'c12arts_psychology',
        name: 'Psychology',
        code: '037',
        description: 'Variations in Psychological Attributes, Personality, Therapeutic Interventions & Social Cognition',
        iconName: 'BrainCircuit',
        units: [
          {
            unitName: 'Core Psychological Concepts & Individual Differences',
            chapters: [
              'Variations in Psychological Attributes (Intelligence Theories: Spearman, Sternberg, Gardner, Emotional Intelligence & Aptitude)',
              'Self and Personality (Concept of Self, Type & Trait Theories: Allport, Cattell, Big 5, Psychodynamic & Humanistic, Projective Tests)',
              'Meeting Life Challenges (Stress Appraisal, General Adaptation Syndrome GAS, Coping Strategies & Positive Mental Health)',
              'Psychological Disorders (Abnormality Concepts, DSM-5 Diagnostic Criteria, Anxiety, Depressive, Schizophrenia & Neurodevelopmental Disorders)',
              'Therapeutic Approaches (Psychodynamic Psychotherapy, Behavioural Systematic Desensitisation, CBT, Humanistic-Existential & Alternative Therapy)',
              'Attitude and Social Cognition (Attitude Formation, Cognitive Dissonance, Social Cognition, Schemas, Prejudices & Attribution Theory)',
              'Social Influence and Group Processes (Group Structure, Group Polarization, Conformity: Asch, Obedience: Milgram & Cooperation/Competition)'
            ]
          }
        ],
        chapters: [
          'Variations in Psychological Attributes (Intelligence Theories: Spearman, Sternberg, Gardner, Emotional Intelligence & Aptitude)',
          'Self and Personality (Concept of Self, Type & Trait Theories: Allport, Cattell, Big 5, Psychodynamic & Humanistic, Projective Tests)',
          'Meeting Life Challenges (Stress Appraisal, General Adaptation Syndrome GAS, Coping Strategies & Positive Mental Health)',
          'Psychological Disorders (Abnormality Concepts, DSM-5 Diagnostic Criteria, Anxiety, Depressive, Schizophrenia & Neurodevelopmental Disorders)',
          'Therapeutic Approaches (Psychodynamic Psychotherapy, Behavioural Systematic Desensitisation, CBT, Humanistic-Existential & Alternative Therapy)',
          'Attitude and Social Cognition (Attitude Formation, Cognitive Dissonance, Social Cognition, Schemas, Prejudices & Attribution Theory)',
          'Social Influence and Group Processes (Group Structure, Group Polarization, Conformity: Asch, Obedience: Milgram & Cooperation/Competition)'
        ]
      },
      {
        id: 'c12arts_economics',
        name: 'Economics',
        code: '030',
        description: 'Introductory Macroeconomics & Indian Economic Development (Shared CBSE Standard)',
        iconName: 'TrendingUp',
        units: [
          {
            unitName: 'Part A: Introductory Macroeconomics',
            chapters: [
              'National Income and Related Aggregates (Circular Flow, GDP, NNP, Value Added, Income & Expenditure Methods)',
              'Money and Banking (Functions of Commercial Banks, Credit Creation Multiplier & RBI Monetary Policy)',
              'Determination of Income and Employment (AD-AS Approach, Investment Multiplier, Deficient & Excess Demand Remedies)',
              'Government Budget and the Economy (Revenue/Capital Receipts & Expenditure, Fiscal, Revenue & Primary Deficits)',
              'Balance of Payments & Foreign Exchange (Current/Capital Account BoP, Autonomous vs Accommodating, Fixed/Flexible Forex)'
            ]
          },
          {
            unitName: 'Part B: Indian Economic Development',
            chapters: [
              'Indian Economy on the Eve of Independence (Agriculture Stagnation, De-industrialisation & Foreign Trade Drain)',
              'Indian Economy (1950 - 1990) (Goals of Five Year Plans, Land Reforms, Green Revolution & IPR 1956)',
              'Economic Reforms Since 1991 (Liberalisation, Privatisation, Globalisation LPG & WTO)',
              'Human Capital Formation in India (Sources of Human Capital, Education Sector & Health Infrastructure)',
              'Rural Development: Credit & Marketing (Micro-finance, SHGs, Agricultural Diversification & Organic Farming)',
              'Employment: Growth, Informalisation & Other Issues (Worker-Population Ratio, Jobless Growth & Casualisation)',
              'Environment and Sustainable Economic Development (Carrying Capacity, Global Warming & Renewable Strategy)',
              'Comparative Development Experiences of India and its Neighbours (India, China, Pakistan Demographic & Sectoral Indicators)'
            ]
          }
        ],
        chapters: [
          'National Income and Related Aggregates (Circular Flow, GDP, NNP, Value Added, Income & Expenditure Methods)',
          'Money and Banking (Functions of Commercial Banks, Credit Creation Multiplier & RBI Monetary Policy)',
          'Determination of Income and Employment (AD-AS Approach, Investment Multiplier, Deficient & Excess Demand Remedies)',
          'Government Budget and the Economy (Revenue/Capital Receipts & Expenditure, Fiscal, Revenue & Primary Deficits)',
          'Balance of Payments & Foreign Exchange (Current/Capital Account BoP, Autonomous vs Accommodating, Fixed/Flexible Forex)',
          'Indian Economy on the Eve of Independence (Agriculture Stagnation, De-industrialisation & Foreign Trade Drain)',
          'Indian Economy (1950 - 1990) (Goals of Five Year Plans, Land Reforms, Green Revolution & IPR 1956)',
          'Economic Reforms Since 1991 (Liberalisation, Privatisation, Globalisation LPG & WTO)',
          'Human Capital Formation in India (Sources of Human Capital, Education Sector & Health Infrastructure)',
          'Rural Development: Credit & Marketing (Micro-finance, SHGs, Agricultural Diversification & Organic Farming)',
          'Employment: Growth, Informalisation & Other Issues (Worker-Population Ratio, Jobless Growth & Casualisation)',
          'Environment and Sustainable Economic Development (Carrying Capacity, Global Warming & Renewable Strategy)',
          'Comparative Development Experiences of India and its Neighbours (India, China, Pakistan Demographic & Sectoral Indicators)'
        ]
      },
      {
        id: 'c12arts_english',
        name: 'English Core',
        code: '301',
        description: 'Reading Comprehension, Advanced Creative Writing & Literature (Flamingo / Vistas)',
        iconName: 'BookOpen',
        chapters: [
          'Reading Comprehension: Discursive & Case-Based Factual Passages',
          'Creative Writing: Notice Writing & Formal/Informal Invitations',
          'Creative Writing: Letters to Editor & Job Applications with Bio-data',
          'Creative Writing: Article & Report Writing',
          'Flamingo Prose: The Last Lesson, Lost Spring, Deep Water & The Rattrap',
          'Flamingo Prose: Indigo, Poets and Pancakes, The Interview & Going Places',
          'Flamingo Poetry: My Mother at Sixty-Six, Keeping Quiet & A Thing of Beauty',
          'Flamingo Poetry: A Roadside Stand & Aunt Jennifer\'s Tigers',
          'Vistas: The Third Level, The Tiger King & Journey to the End of the Earth',
          'Vistas: The Enemy, On the Face of It & Memories of Childhood'
        ]
      }
    ]
  },

  CLASS_11_SCIENCE: {
    id: 'CLASS_11_SCIENCE',
    title: 'Class 11 Science',
    subtitle: 'Senior Secondary CBSE Board & State Syllabus (PCM / PCB / PCMB)',
    badge: 'Class 11 Science',
    defaultLevel: 'Class 11 CBSE (Science)',
    subjects: [
      {
        id: 'c11sci_physics',
        name: 'Physics',
        code: '042',
        description: 'Physical World, Kinematics, Laws of Motion, Work Energy, Gravitation, Mechanics of Solids/Fluids, Thermodynamics & Waves',
        iconName: 'Atom',
        units: [
          {
            unitName: 'Part I: Mechanics & Gravitation',
            chapters: [
              'Units and Measurements (SI Units, Dimensional Analysis & Applications, Errors and Significant Figures)',
              'Motion in a Straight Line (Position-Time Graphs, Instantaneous Velocity, Acceleration, Kinematic Equations by Calculus Method)',
              'Motion in a Plane (Scalars and Vectors, Vector Addition & Resolution, Projectile Motion, Uniform Circular Motion)',
              'Laws of Motion (Newton\'s Three Laws, Inertia, Momentum, Impulse, Static and Kinetic Friction, Circular Dynamics & Banking of Roads)',
              'Work, Energy and Power (Work-Energy Theorem, Conservative vs Non-Conservative Forces, Potential Energy of a Spring, Elastic & Inelastic Collisions)',
              'System of Particles and Rotational Motion (Centre of Mass, Torque, Angular Momentum, Moment of Inertia, Radius of Gyration, Parallel & Perpendicular Axes Theorems)',
              'Gravitation (Kepler\'s Laws, Universal Gravitation, Acceleration due to Gravity \'g\' Variation, Gravitational Potential Energy, Escape Velocity & Orbital Velocity)'
            ]
          },
          {
            unitName: 'Part II: Properties of Bulk Matter, Thermodynamics & Oscillations',
            chapters: [
              'Mechanical Properties of Solids (Stress-Strain Curve, Hooke\'s Law, Young\'s Modulus, Bulk Modulus, Shear Modulus & Poisson\'s Ratio)',
              'Mechanical Properties of Fluids (Pascal\'s Law, Viscosity, Stokes\' Law, Terminal Velocity, Streamline Flow, Bernoulli\'s Principle, Surface Tension & Capillarity)',
              'Thermal Properties of Matter (Heat, Temperature, Thermal Expansion, Specific Heat Capacity, Calorimetry, Latent Heat, Newton\'s Law of Cooling, Conduction & Radiation)',
              'Thermodynamics (Thermal Equilibrium, Zeroth Law, First Law of Thermodynamics, Isothermal & Adiabatic Processes, Second Law, Reversible & Irreversible Processes)',
              'Kinetic Theory of Gases (Equation of State of Ideal Gas, Kinetic Interpretation of Temperature, Degrees of Freedom, Law of Equipartition of Energy, Mean Free Path)',
              'Oscillations (Periodic & Simple Harmonic Motion SHM, Displacement, Velocity, Acceleration, Kinetic & Potential Energy in SHM, Simple Pendulum)',
              'Waves (Transverse & Longitudinal Waves, Speed of Wave Motion, Progressive Wave Equation, Principle of Superposition, Standing Waves in Strings & Pipes, Beats)'
            ]
          }
        ],
        chapters: [
          'Units and Measurements (SI Units, Dimensional Analysis & Applications, Errors and Significant Figures)',
          'Motion in a Straight Line (Position-Time Graphs, Instantaneous Velocity, Acceleration, Kinematic Equations by Calculus Method)',
          'Motion in a Plane (Scalars and Vectors, Vector Addition & Resolution, Projectile Motion, Uniform Circular Motion)',
          'Laws of Motion (Newton\'s Three Laws, Inertia, Momentum, Impulse, Static and Kinetic Friction, Circular Dynamics & Banking of Roads)',
          'Work, Energy and Power (Work-Energy Theorem, Conservative vs Non-Conservative Forces, Potential Energy of a Spring, Elastic & Inelastic Collisions)',
          'System of Particles and Rotational Motion (Centre of Mass, Torque, Angular Momentum, Moment of Inertia, Radius of Gyration, Parallel & Perpendicular Axes Theorems)',
          'Gravitation (Kepler\'s Laws, Universal Gravitation, Acceleration due to Gravity \'g\' Variation, Gravitational Potential Energy, Escape Velocity & Orbital Velocity)',
          'Mechanical Properties of Solids (Stress-Strain Curve, Hooke\'s Law, Young\'s Modulus, Bulk Modulus, Shear Modulus & Poisson\'s Ratio)',
          'Mechanical Properties of Fluids (Pascal\'s Law, Viscosity, Stokes\' Law, Terminal Velocity, Streamline Flow, Bernoulli\'s Principle, Surface Tension & Capillarity)',
          'Thermal Properties of Matter (Heat, Temperature, Thermal Expansion, Specific Heat Capacity, Calorimetry, Latent Heat, Newton\'s Law of Cooling, Conduction & Radiation)',
          'Thermodynamics (Thermal Equilibrium, Zeroth Law, First Law of Thermodynamics, Isothermal & Adiabatic Processes, Second Law, Reversible & Irreversible Processes)',
          'Kinetic Theory of Gases (Equation of State of Ideal Gas, Kinetic Interpretation of Temperature, Degrees of Freedom, Law of Equipartition of Energy, Mean Free Path)',
          'Oscillations (Periodic & Simple Harmonic Motion SHM, Displacement, Velocity, Acceleration, Kinetic & Potential Energy in SHM, Simple Pendulum)',
          'Waves (Transverse & Longitudinal Waves, Speed of Wave Motion, Progressive Wave Equation, Principle of Superposition, Standing Waves in Strings & Pipes, Beats)'
        ]
      },
      {
        id: 'c11sci_chemistry',
        name: 'Chemistry',
        code: '043',
        description: 'Atomic Structure, Periodic Properties, Chemical Bonding, Thermodynamics, Equilibrium, Redox & Organic Chemistry Principles',
        iconName: 'Beaker',
        units: [
          {
            unitName: 'Part I: Inorganic & Physical Chemistry',
            chapters: [
              'Some Basic Concepts of Chemistry (Mole Concept, Molar Mass, Empirical & Molecular Formula, Stoichiometry & Limiting Reagent Calculations)',
              'Structure of Atom (Bohr\'s Model & Limitations, de Broglie Relation, Heisenberg Uncertainty Principle, Quantum Numbers, Orbitals, Aufbau Principle & Hund\'s Rule)',
              'Classification of Elements and Periodicity in Properties (Modern Periodic Table, Trends in Atomic Radii, Ionization Enthalpy, Electron Gain Enthalpy, Electronegativity & Valency)',
              'Chemical Bonding and Molecular Structure (Ionic Bond, Lattice Enthalpy, VSEPR Theory, Hybridization: sp, sp2, sp3, sp3d, sp3d2, Molecular Orbital Theory MOT & Hydrogen Bonding)',
              'Chemical Thermodynamics (System & Surroundings, First Law, Enthalpy of Reactions, Hess\'s Law of Constant Heat Summation, Entropy, Gibbs Free Energy & Spontaneity)',
              'Equilibrium (Law of Mass Action, Kc and Kp, Le Chatelier\'s Principle, Ionic Equilibrium: pH, Buffer Solutions, Common Ion Effect, Solubility Product Ksp)',
              'Redox Reactions (Concept of Oxidation & Reduction, Oxidation Number Method, Ion-Electron Balancing in Acidic & Basic Media)'
            ]
          },
          {
            unitName: 'Part II: Organic Chemistry Fundamentals',
            chapters: [
              'Organic Chemistry: Some Basic Principles and Techniques (IUPAC Nomenclature, Inductive, Electromeric, Resonance & Hyperconjugation Effects, Carbocations/Carbanions/Free Radicals, Reaction Intermediates, Purification Techniques)',
              'Hydrocarbons (Alkanes: Conformations & Free Radical Halogenation; Alkenes: Geometrical Isomerism, Markovnikov & Anti-Markovnikov Addition; Alkynes: Acidity & Additions; Aromatic Hydrocarbons: Benzene Aromaticity, Electrophilic Substitution)'
            ]
          }
        ],
        chapters: [
          'Some Basic Concepts of Chemistry (Mole Concept, Molar Mass, Empirical & Molecular Formula, Stoichiometry & Limiting Reagent Calculations)',
          'Structure of Atom (Bohr\'s Model & Limitations, de Broglie Relation, Heisenberg Uncertainty Principle, Quantum Numbers, Orbitals, Aufbau Principle & Hund\'s Rule)',
          'Classification of Elements and Periodicity in Properties (Modern Periodic Table, Trends in Atomic Radii, Ionization Enthalpy, Electron Gain Enthalpy, Electronegativity & Valency)',
          'Chemical Bonding and Molecular Structure (Ionic Bond, Lattice Enthalpy, VSEPR Theory, Hybridization: sp, sp2, sp3, sp3d, sp3d2, Molecular Orbital Theory MOT & Hydrogen Bonding)',
          'Chemical Thermodynamics (System & Surroundings, First Law, Enthalpy of Reactions, Hess\'s Law of Constant Heat Summation, Entropy, Gibbs Free Energy & Spontaneity)',
          'Equilibrium (Law of Mass Action, Kc and Kp, Le Chatelier\'s Principle, Ionic Equilibrium: pH, Buffer Solutions, Common Ion Effect, Solubility Product Ksp)',
          'Redox Reactions (Concept of Oxidation & Reduction, Oxidation Number Method, Ion-Electron Balancing in Acidic & Basic Media)',
          'Organic Chemistry: Some Basic Principles and Techniques (IUPAC Nomenclature, Inductive, Electromeric, Resonance & Hyperconjugation Effects, Carbocations/Carbanions/Free Radicals, Reaction Intermediates, Purification Techniques)',
          'Hydrocarbons (Alkanes: Conformations & Free Radical Halogenation; Alkenes: Geometrical Isomerism, Markovnikov & Anti-Markovnikov Addition; Alkynes: Acidity & Additions; Aromatic Hydrocarbons: Benzene Aromaticity, Electrophilic Substitution)'
        ]
      },
      {
        id: 'c11sci_maths',
        name: 'Mathematics',
        code: '041',
        description: 'Sets, Relations & Functions, Trigonometry, Complex Numbers, Permutations & Combinations, Binomial, Straight Lines, Conics, Limits & Derivatives',
        iconName: 'Calculator',
        units: [
          {
            unitName: 'Algebra & Trigonometry',
            chapters: [
              'Sets (Types of Sets, Subsets, Universal Set, Venn Diagrams, Union, Intersection & Difference of Sets)',
              'Relations and Functions (Cartesian Product, Relations, Types of Real Functions: Domain & Range, Graphical Representations)',
              'Trigonometric Functions (Radian Measure, Trigonometric Functions of Sum and Difference of Angles, Trigonometric Identities & Equations)',
              'Complex Numbers and Quadratic Equations (Argand Plane, Modulus and Conjugate of Complex Numbers, Solutions of Quadratic Equations)',
              'Linear Inequalities (Algebraic and Graphical Solutions of Linear Inequalities in One and Two Variables)',
              'Permutations and Combinations (Fundamental Principle of Counting, Factorials, Permutations nPr, Combinations nCr & Applications)',
              'Binomial Theorem (Binomial Theorem for Positive Integral Indices, Pascal\'s Triangle, General and Middle Terms)',
              'Sequences and Series (Arithmetic Progression AP, Geometric Progression GP, Sum of n Terms, Arithmetic Mean & Geometric Mean AM-GM Inequality)'
            ]
          },
          {
            unitName: 'Coordinate Geometry, Calculus & Statistics',
            chapters: [
              'Straight Lines (Slope of a Line, Slope-Point, Two-Point, Intercept and Normal Forms, Distance of a Point from a Line)',
              'Conic Sections (Standard Equations and Properties of Circle, Parabola, Ellipse & Hyperbola, Eccentricity and Latus Rectum)',
              'Introduction to Three Dimensional Geometry (Coordinate Axes and Planes in 3D, Distance Formula, Section Formula)',
              'Limits and Derivatives (Intuitive Idea of Limit, Standard Limits of Polynomials & Trigonometric Functions, First Principle Derivative, Product & Quotient Rules)',
              'Statistics (Measures of Dispersion: Range, Mean Deviation, Variance and Standard Deviation for Grouped & Ungrouped Data)',
              'Probability (Random Experiments, Sample Spaces, Events: Mutually Exclusive and Exhaustive Events, Axiomatic Probability)'
            ]
          }
        ],
        chapters: [
          'Sets (Types of Sets, Subsets, Universal Set, Venn Diagrams, Union, Intersection & Difference of Sets)',
          'Relations and Functions (Cartesian Product, Relations, Types of Real Functions: Domain & Range, Graphical Representations)',
          'Trigonometric Functions (Radian Measure, Trigonometric Functions of Sum and Difference of Angles, Trigonometric Identities & Equations)',
          'Complex Numbers and Quadratic Equations (Argand Plane, Modulus and Conjugate of Complex Numbers, Solutions of Quadratic Equations)',
          'Linear Inequalities (Algebraic and Graphical Solutions of Linear Inequalities in One and Two Variables)',
          'Permutations and Combinations (Fundamental Principle of Counting, Factorials, Permutations nPr, Combinations nCr & Applications)',
          'Binomial Theorem (Binomial Theorem for Positive Integral Indices, Pascal\'s Triangle, General and Middle Terms)',
          'Sequences and Series (Arithmetic Progression AP, Geometric Progression GP, Sum of n Terms, Arithmetic Mean & Geometric Mean AM-GM Inequality)',
          'Straight Lines (Slope of a Line, Slope-Point, Two-Point, Intercept and Normal Forms, Distance of a Point from a Line)',
          'Conic Sections (Standard Equations and Properties of Circle, Parabola, Ellipse & Hyperbola, Eccentricity and Latus Rectum)',
          'Introduction to Three Dimensional Geometry (Coordinate Axes and Planes in 3D, Distance Formula, Section Formula)',
          'Limits and Derivatives (Intuitive Idea of Limit, Standard Limits of Polynomials & Trigonometric Functions, First Principle Derivative, Product & Quotient Rules)',
          'Statistics (Measures of Dispersion: Range, Mean Deviation, Variance and Standard Deviation for Grouped & Ungrouped Data)',
          'Probability (Random Experiments, Sample Spaces, Events: Mutually Exclusive and Exhaustive Events, Axiomatic Probability)'
        ]
      },
      {
        id: 'c11sci_biology',
        name: 'Biology',
        code: '044',
        description: 'Diversity of Living Organisms, Cell Biology, Biomolecules, Plant Physiology & Human Physiology',
        iconName: 'Dna',
        units: [
          {
            unitName: 'Diversity & Structural Organisation',
            chapters: [
              'The Living World (Biodiversity, Taxonomic Hierarchy, Binomial Nomenclature)',
              'Biological Classification (Five Kingdom Classification: Monera, Protista, Fungi, Plantae, Animalia, Viruses & Lichens)',
              'Plant Kingdom (Algae, Bryophytes, Pteridophytes, Gymnosperms, Angiosperms & Alternation of Generations)',
              'Animal Kingdom (Basis of Classification: Symmetry, Coelom, Segmentation, Non-Chordata Phyla & Chordata Classes)',
              'Morphology of Flowering Plants (Root, Stem, Leaf Modifications, Inflorescence, Flower Anatomy, Fruit, Seed & Floral Families: Solanaceae/Fabaceae)',
              'Anatomy of Flowering Plants (Meristematic & Permanent Tissues, Tissue Systems, Anatomy of Dicot & Monocot Root/Stem/Leaf, Secondary Growth)',
              'Structural Organisation in Animals (Animal Tissues: Epithelial, Connective, Muscular, Neural & Anatomy of Frog/Cockroach)'
            ]
          },
          {
            unitName: 'Cell Biology & Physiology',
            chapters: [
              'Cell: The Unit of Life (Prokaryotic vs Eukaryotic Cells, Endomembrane System, Mitochondria, Chloroplasts, Ribosomes, Nucleus & Chromosomes)',
              'Biomolecules (Structure and Function of Carbohydrates, Lipids, Proteins, Nucleic Acids, Enzymes & Enzyme Kinetics)',
              'Cell Cycle and Cell Division (Phases of Cell Cycle, Mitosis, Meiosis - Stages of Prophase I & Biological Significance)',
              'Photosynthesis in Higher Plants (Light Reaction, Photophosphorylation, Calvin Cycle C3, Hatch-Slack C4 Pathway, Photorespiration & Factors)',
              'Respiration in Plants (Glycolysis, Fermentation, Krebs Cycle, Electron Transport System ETS & Respiratory Quotient RQ)',
              'Plant Growth and Development (Phases of Growth, Auxins, Gibberellins, Cytokinins, Ethylene, ABA & Photoperiodism)',
              'Breathing and Exchange of Gases (Respiratory Volumes & Capacities, Gas Transport: Oxygen-Hemoglobin Dissociation Curve, Regulation & Disorders)',
              'Body Fluids and Circulation (Blood Composition, ABO & Rh Blood Groups, Cardiac Cycle, ECG, Double Circulation & Heart Disorders)',
              'Excretory Products and their Elimination (Human Excretory System, Nephron, Urine Formation, Counter-Current Mechanism & RAAS Regulation)',
              'Locomotion and Movement (Skeletal System, Joints, Sliding Filament Theory of Muscle Contraction & Muscle Disorders)',
              'Neural Control and Coordination (Neuron Structure, Nerve Impulse Conduction, Central Nervous System, Reflex Arc & Sensory Organs)',
              'Chemical Coordination and Integration (Endocrine Glands: Pituitary, Thyroid, Parathyroid, Adrenal, Pancreas, Hormones & Mechanism of Action)'
            ]
          }
        ],
        chapters: [
          'The Living World (Biodiversity, Taxonomic Hierarchy, Binomial Nomenclature)',
          'Biological Classification (Five Kingdom Classification: Monera, Protista, Fungi, Plantae, Animalia, Viruses & Lichens)',
          'Plant Kingdom (Algae, Bryophytes, Pteridophytes, Gymnosperms, Angiosperms & Alternation of Generations)',
          'Animal Kingdom (Basis of Classification: Symmetry, Coelom, Segmentation, Non-Chordata Phyla & Chordata Classes)',
          'Morphology of Flowering Plants (Root, Stem, Leaf Modifications, Inflorescence, Flower Anatomy, Fruit, Seed & Floral Families: Solanaceae/Fabaceae)',
          'Anatomy of Flowering Plants (Meristematic & Permanent Tissues, Tissue Systems, Anatomy of Dicot & Monocot Root/Stem/Leaf, Secondary Growth)',
          'Structural Organisation in Animals (Animal Tissues: Epithelial, Connective, Muscular, Neural & Anatomy of Frog/Cockroach)',
          'Cell: The Unit of Life (Prokaryotic vs Eukaryotic Cells, Endomembrane System, Mitochondria, Chloroplasts, Ribosomes, Nucleus & Chromosomes)',
          'Biomolecules (Structure and Function of Carbohydrates, Lipids, Proteins, Nucleic Acids, Enzymes & Enzyme Kinetics)',
          'Cell Cycle and Cell Division (Phases of Cell Cycle, Mitosis, Meiosis - Stages of Prophase I & Biological Significance)',
          'Photosynthesis in Higher Plants (Light Reaction, Photophosphorylation, Calvin Cycle C3, Hatch-Slack C4 Pathway, Photorespiration & Factors)',
          'Respiration in Plants (Glycolysis, Fermentation, Krebs Cycle, Electron Transport System ETS & Respiratory Quotient RQ)',
          'Plant Growth and Development (Phases of Growth, Auxins, Gibberellins, Cytokinins, Ethylene, ABA & Photoperiodism)',
          'Breathing and Exchange of Gases (Respiratory Volumes & Capacities, Gas Transport: Oxygen-Hemoglobin Dissociation Curve, Regulation & Disorders)',
          'Body Fluids and Circulation (Blood Composition, ABO & Rh Blood Groups, Cardiac Cycle, ECG, Double Circulation & Heart Disorders)',
          'Excretory Products and their Elimination (Human Excretory System, Nephron, Urine Formation, Counter-Current Mechanism & RAAS Regulation)',
          'Locomotion and Movement (Skeletal System, Joints, Sliding Filament Theory of Muscle Contraction & Muscle Disorders)',
          'Neural Control and Coordination (Neuron Structure, Nerve Impulse Conduction, Central Nervous System, Reflex Arc & Sensory Organs)',
          'Chemical Coordination and Integration (Endocrine Glands: Pituitary, Thyroid, Parathyroid, Adrenal, Pancreas, Hormones & Mechanism of Action)'
        ]
      },
      {
        id: 'c11sci_cs',
        name: 'Computer Science',
        code: '083',
        description: 'Computer Systems, Boolean Logic, Python Fundamentals, Conditionals, Loops, Strings, Lists, Tuples, Dictionaries & Cyber Ethics',
        iconName: 'Laptop',
        units: [
          {
            unitName: 'Computer Systems & Programming in Python',
            chapters: [
              'Computer Systems and Organisation (CPU, Memory Hierarchy, Number Systems: Binary, Octal, Hexadecimal Conversions, Boolean Logic)',
              'Computational Thinking and Programming - I (Python Basics, Tokens, Data Types, Type Conversion, Operators & Expressions)',
              'Control Flow in Python (Conditional Statements: if-elif-else, Iterative Statements: while and for loops, break, continue & nested loops)',
              'Strings and List Manipulation (String Operations, Slicing, Built-in String Methods, List Creation, Traversal, Slicing, List Methods)',
              'Tuples and Dictionaries (Tuple Operations & Immutability, Dictionary Creation, Key-Value Access, Traversal & Methods)',
              'Introduction to Python Modules (Importing Modules: math, random, statistics, Creating Custom Modules)',
              'Society, Law and Ethics (Cyber Safety, Digital Footprint, Cyber Crimes, Phishing, IT Act, IPR, Open Source Software & E-waste Management)'
            ]
          }
        ],
        chapters: [
          'Computer Systems and Organisation (CPU, Memory Hierarchy, Number Systems: Binary, Octal, Hexadecimal Conversions, Boolean Logic)',
          'Computational Thinking and Programming - I (Python Basics, Tokens, Data Types, Type Conversion, Operators & Expressions)',
          'Control Flow in Python (Conditional Statements: if-elif-else, Iterative Statements: while and for loops, break, continue & nested loops)',
          'Strings and List Manipulation (String Operations, Slicing, Built-in String Methods, List Creation, Traversal, Slicing, List Methods)',
          'Tuples and Dictionaries (Tuple Operations & Immutability, Dictionary Creation, Key-Value Access, Traversal & Methods)',
          'Introduction to Python Modules (Importing Modules: math, random, statistics, Creating Custom Modules)',
          'Society, Law and Ethics (Cyber Safety, Digital Footprint, Cyber Crimes, Phishing, IT Act, IPR, Open Source Software & E-waste Management)'
        ]
      },
      {
        id: 'c11sci_english',
        name: 'English Core',
        code: '301',
        description: 'Reading Comprehension, Creative Writing Skills & Literature (Hornbill & Snapshots)',
        iconName: 'BookOpen',
        chapters: [
          'Reading Comprehension: Discursive & Case-Based Factual Passages, Note-Making & Summarisation',
          'Creative Writing Skills: Classified Advertisements (Matrimonial, Situation Vacant/Wanted, Sale/Purchase)',
          'Creative Writing Skills: Poster Designing & Public Appeals',
          'Creative Writing Skills: Speech Writing on Contemporary & Social Themes',
          'Creative Writing Skills: Debate Writing (For / Against the Motion)',
          'Hornbill Prose: The Portrait of a Lady (Khushwant Singh) & We\'re Not Afraid to Die... If We Can All Be Together',
          'Hornbill Prose: Discovering Tut: The Saga Continues, The Adventure (Jayant Narlikar) & Silk Road (Nick Middleton)',
          'Hornbill Poetry: A Photograph (Shirley Toulson), The Laburnum Top (Ted Hughes) & The Voice of the Rain (Walt Whitman)',
          'Hornbill Poetry: Childhood (Markus Natten) & Father to Son (Elizabeth Jennings)',
          'Snapshots: The Summer of the Beautiful White Horse (William Saroyan) & The Address (Marga Minco)',
          'Snapshots: Mother\'s Day (J.B. Priestley), Birth (A.J. Cronin) & The Tale of Melon City (Vikram Seth)'
        ]
      }
    ]
  },

  CLASS_11_COMMERCE: {
    id: 'CLASS_11_COMMERCE',
    title: 'Class 11 Commerce',
    subtitle: 'Senior Secondary CBSE Board & State Syllabus (Rationalized Pattern)',
    badge: 'Class 11 Commerce',
    defaultLevel: 'Class 11 CBSE (Commerce)',
    subjects: [
      {
        id: 'c11comm_accountancy',
        name: 'Accountancy',
        code: '055',
        description: 'Financial Accounting - I & II (Theoretical Framework, Accounting Process, Financial Statements & Single Entry)',
        iconName: 'Calculator',
        units: [
          {
            unitName: 'Part A: Financial Accounting - I',
            chapters: [
              'Introduction to Accounting (Objectives, Basic Accounting Terms: Assets, Liabilities, Capital, Drawings, Revenues, Expenses, Debtors, Creditors)',
              'Theory Base of Accounting (GAAP, Accounting Concepts: Going Concern, Consistency, Accrual, Matching, Conservatism, Dual Aspect, Materiality & Accounting Standards)',
              'Recording of Transactions - I (Source Documents, Vouchers, Accounting Equation, Rules of Debit and Credit, Journal Entries)',
              'Recording of Transactions - II (Cash Book - Simple & Double Column with Petty Cash, Purchases Book, Sales Book, Returns Books & Journal Proper)',
              'Bank Reconciliation Statement (BRS: Causes of Differences between Cash Book and Pass Book balances, Preparation with Amended Cash Book)',
              'Depreciation, Provisions and Reserves (Straight Line Method SLM vs Written Down Value WDV, Asset Disposal Account, Provisions vs Reserves)',
              'Trial Balance and Rectification of Errors (Trial Balance Objectives, Types of Errors: Principle, Omission, Commission, Compensating & Suspense Account)'
            ]
          },
          {
            unitName: 'Part B: Financial Accounting - II',
            chapters: [
              'Financial Statements - I (Meaning, Objectives, Trading Account, Profit and Loss Account & Balance Sheet with Marshalling of Assets/Liabilities)',
              'Financial Statements - II (Adjustments: Closing Stock, Outstanding/Prepaid Expenses, Accrued/Advance Income, Depreciation, Bad Debts & Provision for Doubtful Debts)',
              'Accounts from Incomplete Records (Single Entry System: Statement of Affairs Method for Ascertainment of Profit/Loss)'
            ]
          }
        ],
        chapters: [
          'Introduction to Accounting (Objectives, Basic Accounting Terms: Assets, Liabilities, Capital, Drawings, Revenues, Expenses, Debtors, Creditors)',
          'Theory Base of Accounting (GAAP, Accounting Concepts: Going Concern, Consistency, Accrual, Matching, Conservatism, Dual Aspect, Materiality & Accounting Standards)',
          'Recording of Transactions - I (Source Documents, Vouchers, Accounting Equation, Rules of Debit and Credit, Journal Entries)',
          'Recording of Transactions - II (Cash Book - Simple & Double Column with Petty Cash, Purchases Book, Sales Book, Returns Books & Journal Proper)',
          'Bank Reconciliation Statement (BRS: Causes of Differences between Cash Book and Pass Book balances, Preparation with Amended Cash Book)',
          'Depreciation, Provisions and Reserves (Straight Line Method SLM vs Written Down Value WDV, Asset Disposal Account, Provisions vs Reserves)',
          'Trial Balance and Rectification of Errors (Trial Balance Objectives, Types of Errors: Principle, Omission, Commission, Compensating & Suspense Account)',
          'Financial Statements - I (Meaning, Objectives, Trading Account, Profit and Loss Account & Balance Sheet with Marshalling of Assets/Liabilities)',
          'Financial Statements - II (Adjustments: Closing Stock, Outstanding/Prepaid Expenses, Accrued/Advance Income, Depreciation, Bad Debts & Provision for Doubtful Debts)',
          'Accounts from Incomplete Records (Single Entry System: Statement of Affairs Method for Ascertainment of Profit/Loss)'
        ]
      },
      {
        id: 'c11comm_bst',
        name: 'Business Studies',
        code: '054',
        description: 'Foundations of Business, Corporate Organisation, Business Finance & Trade',
        iconName: 'Briefcase',
        units: [
          {
            unitName: 'Part A: Foundations of Business',
            chapters: [
              'Evolution and Fundamentals of Business (History of Trade & Commerce in India, Indigenous Banking, Types of Hundi, Business Concepts & Objectives, Industry & Commerce)',
              'Forms of Business Organisation (Sole Proprietorship, Joint Hindu Family HUF, Partnership: Types & Registration, Cooperative Societies, Joint Stock Company, One Person Company OPC)',
              'Public, Private and Global Enterprises (Departmental Undertakings, Statutory Corporations, Government Companies, Multi-National Companies MNCs, Joint Ventures & PPP)',
              'Business Services (Banking: Types of Accounts, RTGS, NEFT, Bank Overdraft; Insurance Principles: Life, Fire, Marine; Postal and Warehousing Services)',
              'Emerging Modes of Business (e-Business: Scope, Benefits, Online Payment Systems, Security & Business Process Outsourcing BPO Concept)',
              'Social Responsibility of Business and Business Ethics (Concept, Arguments For & Against, Responsibilities to Interest Groups, Environmental Protection & Business Ethics)'
            ]
          },
          {
            unitName: 'Part B: Finance and Trade',
            chapters: [
              'Sources of Business Finance (Owner\'s Funds vs Borrowed Funds: Equity Shares, Preference Shares, Debentures, Retained Earnings, Commercial Banks, Trade Credit, ADR, GDR, IDR)',
              'Small Business and Enterprises (MSME Definition & Role, Entrepreneurship Development Process, Startup India, Intellectual Property Rights IPR, NSIC & DIC Support)',
              'Internal Trade (Wholesale vs Retail Trade, Types of Retailers: Departmental Stores, Chain Stores, Mail Order; Goods and Services Tax GST Features)',
              'International Business (Scope & Benefits, Export Procedure & Key Documents: Indent, Letter of Credit LC, Bill of Lading; Import Procedure & WTO Role)'
            ]
          }
        ],
        chapters: [
          'Evolution and Fundamentals of Business (History of Trade & Commerce in India, Indigenous Banking, Types of Hundi, Business Concepts & Objectives, Industry & Commerce)',
          'Forms of Business Organisation (Sole Proprietorship, Joint Hindu Family HUF, Partnership: Types & Registration, Cooperative Societies, Joint Stock Company, One Person Company OPC)',
          'Public, Private and Global Enterprises (Departmental Undertakings, Statutory Corporations, Government Companies, Multi-National Companies MNCs, Joint Ventures & PPP)',
          'Business Services (Banking: Types of Accounts, RTGS, NEFT, Bank Overdraft; Insurance Principles: Life, Fire, Marine; Postal and Warehousing Services)',
          'Emerging Modes of Business (e-Business: Scope, Benefits, Online Payment Systems, Security & Business Process Outsourcing BPO Concept)',
          'Social Responsibility of Business and Business Ethics (Concept, Arguments For & Against, Responsibilities to Interest Groups, Environmental Protection & Business Ethics)',
          'Sources of Business Finance (Owner\'s Funds vs Borrowed Funds: Equity Shares, Preference Shares, Debentures, Retained Earnings, Commercial Banks, Trade Credit, ADR, GDR, IDR)',
          'Small Business and Enterprises (MSME Definition & Role, Entrepreneurship Development Process, Startup India, Intellectual Property Rights IPR, NSIC & DIC Support)',
          'Internal Trade (Wholesale vs Retail Trade, Types of Retailers: Departmental Stores, Chain Stores, Mail Order; Goods and Services Tax GST Features)',
          'International Business (Scope & Benefits, Export Procedure & Key Documents: Indent, Letter of Credit LC, Bill of Lading; Import Procedure & WTO Role)'
        ]
      },
      {
        id: 'c11comm_economics',
        name: 'Economics',
        code: '030',
        description: 'Statistics for Economics & Introductory Microeconomics (CBSE Core Standard)',
        iconName: 'TrendingUp',
        units: [
          {
            unitName: 'Part A: Statistics for Economics',
            chapters: [
              'Introduction to Statistics (Meaning, Scope & Functions of Statistics in Economics)',
              'Collection of Data (Sources of Data: Primary vs Secondary, Methods of Collecting Data, Census vs Sample Sampling Errors)',
              'Organisation of Data (Classification of Data, Raw Data, Variables & Frequency Distributions)',
              'Presentation of Data (Tabular, Diagrammatic, Bar Diagrams, Pie Charts, Histograms, Polygons & Ogives)',
              'Measures of Central Tendency (Arithmetic Mean, Weighted Mean, Median & Mode Properties and Calculations)',
              'Correlation (Meaning, Scatter Diagram, Karl Pearson\'s Coefficient of Linear Correlation & Spearman\'s Rank Correlation)',
              'Index Numbers (Meaning, Wholesale Price Index WPI, Consumer Price Index CPI, Laspeyres, Paasche & Fisher\'s Formulae)'
            ]
          },
          {
            unitName: 'Part B: Introductory Microeconomics',
            chapters: [
              'Introduction to Microeconomics (Central Problems of an Economy, Opportunity Cost & Production Possibility Curve PPC)',
              'Consumer\'s Equilibrium and Demand (Utility Analysis - Law of Diminishing Marginal Utility, Indifference Curve IC Analysis, Budget Line, Law of Demand & Price Elasticity of Demand)',
              'Producer Behaviour and Supply (Production Function: Short-Run Law of Variable Proportions, Cost Concepts: Total/Fixed/Variable/Marginal, Revenue Concepts, Producer Equilibrium & Price Elasticity of Supply)',
              'Forms of Market and Price Determination (Perfect Competition: Features, Equilibrium Price and Quantity Determination, Market Demand & Supply Shifts, Price Ceiling & Price Floor)'
            ]
          }
        ],
        chapters: [
          'Introduction to Statistics (Meaning, Scope & Functions of Statistics in Economics)',
          'Collection of Data (Sources of Data: Primary vs Secondary, Methods of Collecting Data, Census vs Sample Sampling Errors)',
          'Organisation of Data (Classification of Data, Raw Data, Variables & Frequency Distributions)',
          'Presentation of Data (Tabular, Diagrammatic, Bar Diagrams, Pie Charts, Histograms, Polygons & Ogives)',
          'Measures of Central Tendency (Arithmetic Mean, Weighted Mean, Median & Mode Properties and Calculations)',
          'Correlation (Meaning, Scatter Diagram, Karl Pearson\'s Coefficient of Linear Correlation & Spearman\'s Rank Correlation)',
          'Index Numbers (Meaning, Wholesale Price Index WPI, Consumer Price Index CPI, Laspeyres, Paasche & Fisher\'s Formulae)',
          'Introduction to Microeconomics (Central Problems of an Economy, Opportunity Cost & Production Possibility Curve PPC)',
          'Consumer\'s Equilibrium and Demand (Utility Analysis - Law of Diminishing Marginal Utility, Indifference Curve IC Analysis, Budget Line, Law of Demand & Price Elasticity of Demand)',
          'Producer Behaviour and Supply (Production Function: Short-Run Law of Variable Proportions, Cost Concepts: Total/Fixed/Variable/Marginal, Revenue Concepts, Producer Equilibrium & Price Elasticity of Supply)',
          'Forms of Market and Price Determination (Perfect Competition: Features, Equilibrium Price and Quantity Determination, Market Demand & Supply Shifts, Price Ceiling & Price Floor)'
        ]
      },
      {
        id: 'c11comm_appliedmath',
        name: 'Applied Mathematics',
        code: '241',
        description: 'Numbers, Algebra, Financial Mathematics, Probability & Statistics for Commerce',
        iconName: 'LineChart',
        units: [
          {
            unitName: 'Units 1-4: Numbers, Algebra & Calculus',
            chapters: [
              'Numbers, Quantification and Numerical Applications (Binary Numbers, Complex Numbers Basics, Indices, Logarithms & Modulo Arithmetic)',
              'Algebra (Sets, Relations, Sequences and Series: Arithmetic Progression AP & Geometric Progression GP, Permutations and Combinations)',
              'Mathematical and Logical Reasoning (Statements, Logical Connectives, Truth Tables & Syllogisms)',
              'Calculus (Concept of Limits and Continuity, Differentiation of Algebraic & Exponential Functions, Tangents and Rates of Change)'
            ]
          },
          {
            unitName: 'Units 5-8: Financial Mathematics & Statistics',
            chapters: [
              'Probability (Classical Probability, Conditional Probability, Total Probability & Bayes Theorem Applications)',
              'Descriptive Statistics (Measures of Dispersion: Range, Quartile Deviation, Mean Deviation, Standard Deviation & Skewness)',
              'Financial Mathematics (Interest and Annuity: Simple & Compound Interest, Nominal vs Effective Rate, Annuity Types, Present & Future Value, Sinking Fund, EMI Calculations)',
              'Coordinate Geometry (Cartesian Plane, Straight Lines: Slope-Point Form, Two-Point Form, Intercept Form & Parallel/Perpendicular Lines)'
            ]
          }
        ],
        chapters: [
          'Numbers, Quantification and Numerical Applications (Binary Numbers, Complex Numbers Basics, Indices, Logarithms & Modulo Arithmetic)',
          'Algebra (Sets, Relations, Sequences and Series: Arithmetic Progression AP & Geometric Progression GP, Permutations and Combinations)',
          'Mathematical and Logical Reasoning (Statements, Logical Connectives, Truth Tables & Syllogisms)',
          'Calculus (Concept of Limits and Continuity, Differentiation of Algebraic & Exponential Functions, Tangents and Rates of Change)',
          'Probability (Classical Probability, Conditional Probability, Total Probability & Bayes Theorem Applications)',
          'Descriptive Statistics (Measures of Dispersion: Range, Quartile Deviation, Mean Deviation, Standard Deviation & Skewness)',
          'Financial Mathematics (Interest and Annuity: Simple & Compound Interest, Nominal vs Effective Rate, Annuity Types, Present & Future Value, Sinking Fund, EMI Calculations)',
          'Coordinate Geometry (Cartesian Plane, Straight Lines: Slope-Point Form, Two-Point Form, Intercept Form & Parallel/Perpendicular Lines)'
        ]
      },
      {
        id: 'c11comm_entrepreneurship',
        name: 'Entrepreneurship',
        code: '066',
        description: 'Entrepreneurial Journey, Business Concepts, Feasibility, Finance & Marketing (CBSE Pattern)',
        iconName: 'Zap',
        units: [
          {
            unitName: 'Foundations of Entrepreneurship',
            chapters: [
              'Entrepreneurship: What, Why and How (Concept, Need, Myths, Competencies & Roles in Economic Development)',
              'An Entrepreneur (Types of Entrepreneurs, Intrapreneurship, Motivation & Ethical Entrepreneurship)',
              'Entrepreneurial Journey (Idea Generation, Opportunity Recognition, Environmental Scanning & Problem Solving Techniques)',
              'Entrepreneurship as Innovation and Problem Solving (Design Thinking, Business Model Canvas BMC & Innovation Models)',
              'Concept of Market: Market Assessment and Feasibility Study (Market Research, Consumer Analysis & Marketing Mix 4Ps)',
              'Business Finance and Arithmetic (Unit Cost, Unit Price, Break-Even Point BEP Analysis, Cash Flow Projections & Working Capital)',
              'Resource Mobilization (Types of Resources: Human, Physical, Financial Resources, Pitch Deck & Investor Presentation)'
            ]
          }
        ],
        chapters: [
          'Entrepreneurship: What, Why and How (Concept, Need, Myths, Competencies & Roles in Economic Development)',
          'An Entrepreneur (Types of Entrepreneurs, Intrapreneurship, Motivation & Ethical Entrepreneurship)',
          'Entrepreneurial Journey (Idea Generation, Opportunity Recognition, Environmental Scanning & Problem Solving Techniques)',
          'Entrepreneurship as Innovation and Problem Solving (Design Thinking, Business Model Canvas BMC & Innovation Models)',
          'Concept of Market: Market Assessment and Feasibility Study (Market Research, Consumer Analysis & Marketing Mix 4Ps)',
          'Business Finance and Arithmetic (Unit Cost, Unit Price, Break-Even Point BEP Analysis, Cash Flow Projections & Working Capital)',
          'Resource Mobilization (Types of Resources: Human, Physical, Financial Resources, Pitch Deck & Investor Presentation)'
        ]
      },
      {
        id: 'c11comm_english',
        name: 'English Core',
        code: '301',
        description: 'Reading Comprehension, Creative Writing Skills & Literature (Hornbill & Snapshots)',
        iconName: 'BookOpen',
        chapters: [
          'Reading Comprehension: Discursive & Case-Based Factual Passages, Note-Making & Summarisation',
          'Creative Writing Skills: Classified Advertisements (Matrimonial, Situation Vacant/Wanted, Sale/Purchase)',
          'Creative Writing Skills: Poster Designing & Public Appeals',
          'Creative Writing Skills: Speech Writing on Contemporary & Social Themes',
          'Creative Writing Skills: Debate Writing (For / Against the Motion)',
          'Hornbill Prose: The Portrait of a Lady (Khushwant Singh) & We\'re Not Afraid to Die... If We Can All Be Together',
          'Hornbill Prose: Discovering Tut: The Saga Continues, The Adventure (Jayant Narlikar) & Silk Road (Nick Middleton)',
          'Hornbill Poetry: A Photograph (Shirley Toulson), The Laburnum Top (Ted Hughes) & The Voice of the Rain (Walt Whitman)',
          'Hornbill Poetry: Childhood (Markus Natten) & Father to Son (Elizabeth Jennings)',
          'Snapshots: The Summer of the Beautiful White Horse (William Saroyan) & The Address (Marga Minco)',
          'Snapshots: Mother\'s Day (J.B. Priestley), Birth (A.J. Cronin) & The Tale of Melon City (Vikram Seth)'
        ]
      }
    ]
  },

  CLASS_11_ARTS: {
    id: 'CLASS_11_ARTS',
    title: 'Class 11 Arts / Humanities',
    subtitle: 'Senior Secondary Foundation CBSE & State Syllabus (Rationalized Pattern)',
    badge: 'Class 11 Arts',
    defaultLevel: 'Class 11 CBSE (Humanities)',
    subjects: [
      {
        id: 'c11arts_history',
        name: 'History',
        code: '027',
        description: 'Themes in World History (Early Societies, Classical Empires, Feudalism, Renaissance & Modernisation)',
        iconName: 'Landmark',
        units: [
          {
            unitName: 'Section 1: Early Societies',
            chapters: [
              'Writing and City Life (Mesopotamian Civilisation, Urban Economy, Cuneiform Script & Legacy of Mesopotamia)'
            ]
          },
          {
            unitName: 'Section 2: Classical Empires',
            chapters: [
              'An Empire Across Three Continents (The Roman Empire: Political Structure, Gender, Literacy, Slavery & Late Antiquity)',
              'Nomadic Empires (The Mongol Empire, Genghis Khan\'s Military Organisation, Yasa Code & Trans-Eurasian Trade)'
            ]
          },
          {
            unitName: 'Section 3: Changing Traditions',
            chapters: [
              'The Three Orders (Feudal Society in Europe: Clergy, Nobility, Peasantry, Manorial Estate & 14th-Century Crisis)',
              'Changing Cultural Traditions (The Renaissance in Italy, Humanism, Science, Printing Press & Debate on Women)',
              'Displacing Indigenous Peoples (European Settlement in North America and Australia, Treaties & Dispossession)'
            ]
          },
          {
            unitName: 'Section 4: Towards Modernisation',
            chapters: [
              'Paths to Modernisation (Comparative Modernisation: Meiji Restoration in Japan, Opium Wars & Communist Revolution in China)'
            ]
          }
        ],
        chapters: [
          'Writing and City Life (Mesopotamian Civilisation, Urban Economy, Cuneiform Script & Legacy of Mesopotamia)',
          'An Empire Across Three Continents (The Roman Empire: Political Structure, Gender, Literacy, Slavery & Late Antiquity)',
          'Nomadic Empires (The Mongol Empire, Genghis Khan\'s Military Organisation, Yasa Code & Trans-Eurasian Trade)',
          'The Three Orders (Feudal Society in Europe: Clergy, Nobility, Peasantry, Manorial Estate & 14th-Century Crisis)',
          'Changing Cultural Traditions (The Renaissance in Italy, Humanism, Science, Printing Press & Debate on Women)',
          'Displacing Indigenous Peoples (European Settlement in North America and Australia, Treaties & Dispossession)',
          'Paths to Modernisation (Comparative Modernisation: Meiji Restoration in Japan, Opium Wars & Communist Revolution in China)'
        ]
      },
      {
        id: 'c11arts_polsci',
        name: 'Political Science',
        code: '028',
        description: 'Indian Constitution at Work & Political Theory (CBSE Rationalized Syllabus)',
        iconName: 'Shield',
        units: [
          {
            unitName: 'Part A: Indian Constitution at Work',
            chapters: [
              'Constitution: Why and How? & Rights in the Indian Constitution (Constituent Assembly, Fundamental Rights, DPSP & Judicial Remedies)',
              'Election and Representation (First-Past-The-Post vs Proportional Representation, Election Commission of India)',
              'Executive (Presidential vs Parliamentary Executive, Prime Minister, Council of Ministers & Permanent Civil Services)',
              'Legislature (Need for Bicameral Parliament, Lok Sabha vs Rajya Sabha, Law-Making Process & Parliamentary Control)',
              'Judiciary (Independence of Judiciary, Jurisdiction of Supreme Court, Judicial Review & Public Interest Litigation PIL)',
              'Federalism (Division of Powers, Centre-State Relations, Financial Autonomy & Demands for State Autonomy)',
              'Local Governments (Need for Decentralisation, 73rd & 74th Constitutional Amendments, Gram Sabha & Urban Bodies)',
              'Constitution as a Living Document & Philosophy of Constitution (Amendment Procedures, Basic Structure Doctrine & Moral Values)'
            ]
          },
          {
            unitName: 'Part B: Political Theory',
            chapters: [
              'Political Theory: An Introduction (Scope, Relevance & Meaning of Political Concepts in Everyday Life)',
              'Freedom / Liberty (Negative vs Positive Liberty, J.S. Mill\'s Harm Principle & Constraints on Freedom)',
              'Equality (Significance, Three Dimensions: Political, Economic & Social, Affirmative Action / Protective Discrimination)',
              'Social Justice (Rawls\' Theory of Justice, Veil of Ignorance, Proportional Justice & Just Distribution)',
              'Rights (Meaning, Natural Rights, Legal Rights, Human Rights & Relation between Rights and Responsibilities)',
              'Citizenship (Full and Equal Membership, Citizen and Nation, Universal Citizenship & Global Citizenship)',
              'Nationalism (Concept of Nation, National Self-Determination, Inclusive vs Exclusive Nationalism)',
              'Secularism (Western vs Indian Model of Secularism, Inter-religious & Intra-religious Domination, Critiques of Indian Secularism)'
            ]
          }
        ],
        chapters: [
          'Constitution: Why and How? & Rights in the Indian Constitution (Constituent Assembly, Fundamental Rights, DPSP & Judicial Remedies)',
          'Election and Representation (First-Past-The-Post vs Proportional Representation, Election Commission of India)',
          'Executive (Presidential vs Parliamentary Executive, Prime Minister, Council of Ministers & Permanent Civil Services)',
          'Legislature (Need for Bicameral Parliament, Lok Sabha vs Rajya Sabha, Law-Making Process & Parliamentary Control)',
          'Judiciary (Independence of Judiciary, Jurisdiction of Supreme Court, Judicial Review & Public Interest Litigation PIL)',
          'Federalism (Division of Powers, Centre-State Relations, Financial Autonomy & Demands for State Autonomy)',
          'Local Governments (Need for Decentralisation, 73rd & 74th Constitutional Amendments, Gram Sabha & Urban Bodies)',
          'Constitution as a Living Document & Philosophy of Constitution (Amendment Procedures, Basic Structure Doctrine & Moral Values)',
          'Political Theory: An Introduction (Scope, Relevance & Meaning of Political Concepts in Everyday Life)',
          'Freedom / Liberty (Negative vs Positive Liberty, J.S. Mill\'s Harm Principle & Constraints on Freedom)',
          'Equality (Significance, Three Dimensions: Political, Economic & Social, Affirmative Action / Protective Discrimination)',
          'Social Justice (Rawls\' Theory of Justice, Veil of Ignorance, Proportional Justice & Just Distribution)',
          'Rights (Meaning, Natural Rights, Legal Rights, Human Rights & Relation between Rights and Responsibilities)',
          'Citizenship (Full and Equal Membership, Citizen and Nation, Universal Citizenship & Global Citizenship)',
          'Nationalism (Concept of Nation, National Self-Determination, Inclusive vs Exclusive Nationalism)',
          'Secularism (Western vs Indian Model of Secularism, Inter-religious & Intra-religious Domination, Critiques of Indian Secularism)'
        ]
      },
      {
        id: 'c11arts_geography',
        name: 'Geography',
        code: '029',
        description: 'Fundamentals of Physical Geography & India: Physical Environment (CBSE Standard)',
        iconName: 'Compass',
        units: [
          {
            unitName: 'Book 1: Fundamentals of Physical Geography',
            chapters: [
              'Geography as a Discipline (Nature, Branches & Spatial Synthesis)',
              'The Earth: Origin & Evolution, Interior of Earth (Earthquake Waves & Shadow Zones)',
              'Distribution of Oceans and Continents (Continental Drift Theory, Seafloor Spreading & Plate Tectonics)',
              'Geomorphic Processes (Endogenic vs Exogenic, Weathering, Mass Movements & Erosion)',
              'Landforms and their Evolution (Fluvial, Groundwater/Karst, Glacial, Aeolian & Coastal Landforms)',
              'Solar Radiation, Heat Balance and Temperature (Insolation Factors, Terrestrial Radiation & Inversion of Temperature)',
              'Atmospheric Circulation and Weather Systems (Pressure Belts, Planetary Winds, Tropical & Extra-Tropical Cyclones)',
              'Water in the Atmosphere (Humidity, Condensation Types, Precipitation & Rainfall Types)',
              'World Climate and Climate Change (Koeppen Classification, Greenhouse Gases & Global Warming)',
              'Water (Oceans): Submarine Relief, Temperature, Salinity, Ocean Waves, Tides & Ocean Currents',
              'Life on the Earth: Biodiversity and Conservation (Ecosystems, Biomes, Hotspots & Conservation Strategies)'
            ]
          },
          {
            unitName: 'Book 2: India: Physical Environment',
            chapters: [
              'India: Location, Space Relations, Size and Latitudinal/Longitudinal Extent',
              'Structure and Physiography (The Northern Mountains, Northern Plains, Peninsular Plateau, Coastal Plains & Islands)',
              'Drainage Systems of India (Himalayan vs Peninsular River Systems, Indus, Ganga, Brahmaputra, Godavari & River Basin Water Regimes)',
              'Climate of India (Monsoon Origin Mechanism, El Nino, Southern Oscillation, Seasons & Distribution of Rainfall)',
              'Natural Vegetation of India (Tropical Evergreen, Deciduous, Thorn, Montane & Mangrove Forests, Forest Conservation Act)',
              'Soils of India (ICAR Classification: Alluvial, Black, Red-Yellow, Laterite, Arid, Saline & Soil Conservation Techniques)',
              'Natural Hazards and Disasters in India (Earthquakes, Tsunami, Tropical Cyclones, Floods, Droughts & Landslide Risk Management)'
            ]
          }
        ],
        chapters: [
          'Geography as a Discipline (Nature, Branches & Spatial Synthesis)',
          'The Earth: Origin & Evolution, Interior of Earth (Earthquake Waves & Shadow Zones)',
          'Distribution of Oceans and Continents (Continental Drift Theory, Seafloor Spreading & Plate Tectonics)',
          'Geomorphic Processes (Endogenic vs Exogenic, Weathering, Mass Movements & Erosion)',
          'Landforms and their Evolution (Fluvial, Groundwater/Karst, Glacial, Aeolian & Coastal Landforms)',
          'Solar Radiation, Heat Balance and Temperature (Insolation Factors, Terrestrial Radiation & Inversion of Temperature)',
          'Atmospheric Circulation and Weather Systems (Pressure Belts, Planetary Winds, Tropical & Extra-Tropical Cyclones)',
          'Water in the Atmosphere (Humidity, Condensation Types, Precipitation & Rainfall Types)',
          'World Climate and Climate Change (Koeppen Classification, Greenhouse Gases & Global Warming)',
          'Water (Oceans): Submarine Relief, Temperature, Salinity, Ocean Waves, Tides & Ocean Currents',
          'Life on the Earth: Biodiversity and Conservation (Ecosystems, Biomes, Hotspots & Conservation Strategies)',
          'India: Location, Space Relations, Size and Latitudinal/Longitudinal Extent',
          'Structure and Physiography (The Northern Mountains, Northern Plains, Peninsular Plateau, Coastal Plains & Islands)',
          'Drainage Systems of India (Himalayan vs Peninsular River Systems, Indus, Ganga, Brahmaputra, Godavari & River Basin Water Regimes)',
          'Climate of India (Monsoon Origin Mechanism, El Nino, Southern Oscillation, Seasons & Distribution of Rainfall)',
          'Natural Vegetation of India (Tropical Evergreen, Deciduous, Thorn, Montane & Mangrove Forests, Forest Conservation Act)',
          'Soils of India (ICAR Classification: Alluvial, Black, Red-Yellow, Laterite, Arid, Saline & Soil Conservation Techniques)',
          'Natural Hazards and Disasters in India (Earthquakes, Tsunami, Tropical Cyclones, Floods, Droughts & Landslide Risk Management)'
        ]
      },
      {
        id: 'c11arts_sociology',
        name: 'Sociology',
        code: '039',
        description: 'Introducing Sociology & Understanding Society (Foundation Sociological Paradigms)',
        iconName: 'Users',
        units: [
          {
            unitName: 'Book 1: Introducing Sociology',
            chapters: [
              'Sociology and Society (Sociological Perspective, Plurality of Societies, Common Sense vs Sociology)',
              'Terms, Concepts and their Use in Sociology (Social Groups, Social Stratification, Status & Role, Social Control)',
              'Understanding Social Institutions (Family, Marriage, Kinship, Work and Economic Life, Political Institutions, Religion & Education)',
              'Culture and Socialisation (Defining Culture, Dimensions of Culture, Ethnocentrism, Cultural Change & Agencies of Socialisation)'
            ]
          },
          {
            unitName: 'Book 2: Understanding Society',
            chapters: [
              'Social Structure, Stratification and Social Processes in Society (Social Processes: Cooperation, Competition, Conflict)',
              'Social Change and Social Order in Rural and Urban Society (Social Order, Domination, Authority, Law, Crime & Urbanisation)',
              'Environment and Society (Ecology, Resource Depletion, Environmental Crises & Sustainable Development Paradigms)',
              'Introducing Western Sociologists (Karl Marx: Class Conflict, Emile Durkheim: Social Facts & Division of Labour, Max Weber: Social Action & Bureaucracy)',
              'Indian Sociologists (G.S. Ghurye on Caste & Tribe, D.P. Mukerji on Tradition & Change, A.R. Desai on State, M.N. Srinivas on Village Studies)'
            ]
          }
        ],
        chapters: [
          'Sociology and Society (Sociological Perspective, Plurality of Societies, Common Sense vs Sociology)',
          'Terms, Concepts and their Use in Sociology (Social Groups, Social Stratification, Status & Role, Social Control)',
          'Understanding Social Institutions (Family, Marriage, Kinship, Work and Economic Life, Political Institutions, Religion & Education)',
          'Culture and Socialisation (Defining Culture, Dimensions of Culture, Ethnocentrism, Cultural Change & Agencies of Socialisation)',
          'Social Structure, Stratification and Social Processes in Society (Social Processes: Cooperation, Competition, Conflict)',
          'Social Change and Social Order in Rural and Urban Society (Social Order, Domination, Authority, Law, Crime & Urbanisation)',
          'Environment and Society (Ecology, Resource Depletion, Environmental Crises & Sustainable Development Paradigms)',
          'Introducing Western Sociologists (Karl Marx: Class Conflict, Emile Durkheim: Social Facts & Division of Labour, Max Weber: Social Action & Bureaucracy)',
          'Indian Sociologists (G.S. Ghurye on Caste & Tribe, D.P. Mukerji on Tradition & Change, A.R. Desai on State, M.N. Srinivas on Village Studies)'
        ]
      },
      {
        id: 'c11arts_psychology',
        name: 'Psychology',
        code: '037',
        description: 'Foundations of Psychology (Methods, Biological Bases, Sensation, Learning, Memory, Thinking & Emotion)',
        iconName: 'BrainCircuit',
        units: [
          {
            unitName: 'Foundations of Psychological Processes',
            chapters: [
              'What is Psychology? (Evolution of Discipline, Biological & Social Foundations, Mind-Brain Relationship & Psychological Disciplines)',
              'Methods of Enquiry in Psychology (Goals of Psychological Enquiry, Experimental Method, Survey, Case Study, Psychological Testing & Ethical Issues)',
              'Human Development (Meaning, Principles of Development, Factors Influencing Development: Heredity & Environment, Developmental Stages)',
              'Sensory, Attentional and Perceptual Processes (Structure of Eye/Ear, Attentional Processes: Selective vs Sustained Attention, Gestalt Principles)',
              'Learning (Paradigms of Learning: Classical & Operant Conditioning, Observational Learning, Cognitive Learning & Transfer of Learning)',
              'Human Memory (Stage Model: Sensory, Short-Term STM, Long-Term Memory LTM, Levels of Processing, Forgetting Causes & Mnemonics)',
              'Thinking (Nature of Thinking, Building Blocks: Concepts & Schemas, Reasoning, Problem Solving Strategies, Decision Making & Creative Thinking)',
              'Motivation and Emotion (Types of Motives: Biological & Psychosocial, Maslow\'s Hierarchy of Needs, Nature of Emotion & Emotional Expression)'
            ]
          }
        ],
        chapters: [
          'What is Psychology? (Evolution of Discipline, Biological & Social Foundations, Mind-Brain Relationship & Psychological Disciplines)',
          'Methods of Enquiry in Psychology (Goals of Psychological Enquiry, Experimental Method, Survey, Case Study, Psychological Testing & Ethical Issues)',
          'Human Development (Meaning, Principles of Development, Factors Influencing Development: Heredity & Environment, Developmental Stages)',
          'Sensory, Attentional and Perceptual Processes (Structure of Eye/Ear, Attentional Processes: Selective vs Sustained Attention, Gestalt Principles)',
          'Learning (Paradigms of Learning: Classical & Operant Conditioning, Observational Learning, Cognitive Learning & Transfer of Learning)',
          'Human Memory (Stage Model: Sensory, Short-Term STM, Long-Term Memory LTM, Levels of Processing, Forgetting Causes & Mnemonics)',
          'Thinking (Nature of Thinking, Building Blocks: Concepts & Schemas, Reasoning, Problem Solving Strategies, Decision Making & Creative Thinking)',
          'Motivation and Emotion (Types of Motives: Biological & Psychosocial, Maslow\'s Hierarchy of Needs, Nature of Emotion & Emotional Expression)'
        ]
      },
      {
        id: 'c11arts_economics',
        name: 'Economics',
        code: '030',
        description: 'Statistics for Economics & Introductory Microeconomics (CBSE Core Standard)',
        iconName: 'TrendingUp',
        units: [
          {
            unitName: 'Part A: Statistics for Economics',
            chapters: [
              'Introduction to Statistics (Meaning, Scope & Functions of Statistics in Economics)',
              'Collection of Data (Sources of Data: Primary vs Secondary, Methods of Collecting Data, Census vs Sample Sampling Errors)',
              'Organisation of Data (Classification of Data, Raw Data, Variables & Frequency Distributions)',
              'Presentation of Data (Tabular, Diagrammatic, Bar Diagrams, Pie Charts, Histograms, Polygons & Ogives)',
              'Measures of Central Tendency (Arithmetic Mean, Weighted Mean, Median & Mode Properties and Calculations)',
              'Correlation (Meaning, Scatter Diagram, Karl Pearson\'s Coefficient of Linear Correlation & Spearman\'s Rank Correlation)',
              'Index Numbers (Meaning, Wholesale Price Index WPI, Consumer Price Index CPI, Laspeyres, Paasche & Fisher\'s Formulae)'
            ]
          },
          {
            unitName: 'Part B: Introductory Microeconomics',
            chapters: [
              'Introduction to Microeconomics (Central Problems of an Economy, Opportunity Cost & Production Possibility Curve PPC)',
              'Consumer\'s Equilibrium and Demand (Utility Analysis - Law of Diminishing Marginal Utility, Indifference Curve IC Analysis, Budget Line, Law of Demand & Price Elasticity of Demand)',
              'Producer Behaviour and Supply (Production Function: Short-Run Law of Variable Proportions, Cost Concepts: Total/Fixed/Variable/Marginal, Revenue Concepts, Producer Equilibrium & Price Elasticity of Supply)',
              'Forms of Market and Price Determination (Perfect Competition: Features, Equilibrium Price and Quantity Determination, Market Demand & Supply Shifts, Price Ceiling & Price Floor)'
            ]
          }
        ],
        chapters: [
          'Introduction to Statistics (Meaning, Scope & Functions of Statistics in Economics)',
          'Collection of Data (Sources of Data: Primary vs Secondary, Methods of Collecting Data, Census vs Sample Sampling Errors)',
          'Organisation of Data (Classification of Data, Raw Data, Variables & Frequency Distributions)',
          'Presentation of Data (Tabular, Diagrammatic, Bar Diagrams, Pie Charts, Histograms, Polygons & Ogives)',
          'Measures of Central Tendency (Arithmetic Mean, Weighted Mean, Median & Mode Properties and Calculations)',
          'Correlation (Meaning, Scatter Diagram, Karl Pearson\'s Coefficient of Linear Correlation & Spearman\'s Rank Correlation)',
          'Index Numbers (Meaning, Wholesale Price Index WPI, Consumer Price Index CPI, Laspeyres, Paasche & Fisher\'s Formulae)',
          'Introduction to Microeconomics (Central Problems of an Economy, Opportunity Cost & Production Possibility Curve PPC)',
          'Consumer\'s Equilibrium and Demand (Utility Analysis - Law of Diminishing Marginal Utility, Indifference Curve IC Analysis, Budget Line, Law of Demand & Price Elasticity of Demand)',
          'Producer Behaviour and Supply (Production Function: Short-Run Law of Variable Proportions, Cost Concepts: Total/Fixed/Variable/Marginal, Revenue Concepts, Producer Equilibrium & Price Elasticity of Supply)',
          'Forms of Market and Price Determination (Perfect Competition: Features, Equilibrium Price and Quantity Determination, Market Demand & Supply Shifts, Price Ceiling & Price Floor)'
        ]
      },
      {
        id: 'c11arts_english',
        name: 'English Core',
        code: '301',
        description: 'Reading Comprehension, Creative Writing Skills & Literature (Hornbill & Snapshots)',
        iconName: 'BookOpen',
        chapters: [
          'Reading Comprehension: Discursive & Case-Based Factual Passages, Note-Making & Summarisation',
          'Creative Writing Skills: Classified Advertisements (Matrimonial, Situation Vacant/Wanted, Sale/Purchase)',
          'Creative Writing Skills: Poster Designing & Public Appeals',
          'Creative Writing Skills: Speech Writing on Contemporary & Social Themes',
          'Creative Writing Skills: Debate Writing (For / Against the Motion)',
          'Hornbill Prose: The Portrait of a Lady (Khushwant Singh) & We\'re Not Afraid to Die... If We Can All Be Together',
          'Hornbill Prose: Discovering Tut: The Saga Continues, The Adventure (Jayant Narlikar) & Silk Road (Nick Middleton)',
          'Hornbill Poetry: A Photograph (Shirley Toulson), The Laburnum Top (Ted Hughes) & The Voice of the Rain (Walt Whitman)',
          'Hornbill Poetry: Childhood (Markus Natten) & Father to Son (Elizabeth Jennings)',
          'Snapshots: The Summer of the Beautiful White Horse (William Saroyan) & The Address (Marga Minco)',
          'Snapshots: Mother\'s Day (J.B. Priestley), Birth (A.J. Cronin) & The Tale of Melon City (Vikram Seth)'
        ]
      }
    ]
  },

  CA_FOUNDATION: {
    id: 'CA_FOUNDATION',
    title: 'CA Foundation (ICAI)',
    subtitle: 'Institute of Chartered Accountants of India Entry Level',
    badge: 'ICAI CA Foundation',
    defaultLevel: 'CA Foundation ICAI',
    subjects: [
      {
        id: 'ca_accounting',
        name: 'Principles and Practice of Accounting',
        description: 'Paper 1: Accounting Process, BRS, Inventories, Depreciation, NPO, Partnership & Companies',
        iconName: 'Landmark',
        chapters: [
          'Theoretical Framework & Accounting Standards',
          'Accounting Process: Journal, Ledger, Trial Balance & Rectification',
          'Bank Reconciliation Statement (BRS)',
          'Inventories: Cost Formulas, FIFO, Weighted Average & Valuation',
          'Depreciation and Amortisation (SLM & WDV)',
          'Bills of Exchange and Promissory Notes',
          'Final Accounts of Sole Proprietors and Manufacturing Entities',
          'Financial Statements of Not-for-Profit Organisations (NPO)',
          'Accounts from Incomplete Records (Single Entry System)',
          'Partnership Accounts (Admission, Retirement & Death)',
          'Dissolution of Partnership Firm (Garner v Murray & Piecemeal Distribution)',
          'Company Accounts (Issue, Forfeiture & Reissue of Shares)',
          'Redemption of Preference Shares & Debentures',
          'Accounting for Bonus Issue and Right Issue'
        ]
      },
      {
        id: 'ca_law',
        name: 'Business Laws',
        description: 'Paper 2: Indian Regulatory Framework, Contract Act, Sale of Goods, Partnership, LLP & Companies',
        iconName: 'Scale',
        chapters: [
          'Indian Regulatory Framework (Hierarchy of Courts & Regulatory Bodies)',
          'Indian Contract Act, 1872: Nature of Contracts & Offer/Acceptance',
          'Indian Contract Act, 1872: Consideration & Free Consent',
          'Indian Contract Act, 1872: Performance & Breach of Contract',
          'Sale of Goods Act, 1930: Formation & Conditions/Warranties',
          'Sale of Goods Act, 1930: Transfer of Ownership & Unpaid Seller',
          'Indian Partnership Act, 1932: General Nature of Partnership',
          'Indian Partnership Act, 1932: Relations of Partners & Dissolution',
          'The Limited Liability Partnership Act, 2008 (LLP)',
          'The Companies Act, 2013: Incorporation, MOA, AOA & Share Capital',
          'The Negotiable Instruments Act, 1881 (Promissory Notes, Cheques & Sec 138)'
        ]
      },
      {
        id: 'ca_quant',
        name: 'Quantitative Aptitude',
        description: 'Paper 3: Business Mathematics, Logical Reasoning & Statistics',
        iconName: 'Binary',
        chapters: [
          'Ratio, Proportion, Indices and Logarithms',
          'Equations: Linear, Quadratic & Matrices',
          'Linear Inequalities with Objective Functions',
          'Time Value of Money: Simple/Compound Interest, Annuity & Sinking Fund',
          'Permutations and Combinations',
          'Sequence and Series (AP & GP)',
          'Sets, Relations and Functions',
          'Basic Differential and Integral Calculus',
          'Logical Reasoning: Number Series, Coding-Decoding & Odd Man Out',
          'Logical Reasoning: Direction Sense & Seating Arrangements',
          'Logical Reasoning: Blood Relations & Syllogism',
          'Statistical Description of Data (Histogram, Ogive, Pie)',
          'Measures of Central Tendency and Dispersion (Mean, Median, SD, Variance)',
          'Probability & Mathematical Expectation',
          'Theoretical Distributions (Binomial, Poisson, Normal)',
          'Correlation and Regression Analysis',
          'Index Numbers and Time Series'
        ]
      },
      {
        id: 'ca_economics',
        name: 'Business Economics',
        description: 'Paper 4: Microeconomics, Theory of Demand/Supply, Cost & Markets',
        iconName: 'PieChart',
        chapters: [
          'Introduction to Business Economics (Nature, Scope & Basic Problems)',
          'Theory of Demand and Elasticity of Demand',
          'Theory of Consumer Behaviour (Utility & Indifference Curves)',
          'Theory of Supply and Elasticity of Supply',
          'Theory of Production (Laws of Variable Proportions & Returns to Scale)',
          'Theory of Cost (Short Run & Long Run Cost Curves)',
          'Price Determination in Different Markets (Perfect Competition, Monopoly, Monopolistic & Oligopoly)',
          'Business Cycles (Phases, Causes & Indicators)'
        ]
      }
    ]
  },

  CA_INTERMEDIATE: {
    id: 'CA_INTERMEDIATE',
    title: 'CA Intermediate (ICAI New Scheme)',
    subtitle: 'Institute of Chartered Accountants of India - Intermediate Level (Group 1 & Group 2)',
    badge: 'ICAI CA Intermediate',
    defaultLevel: 'CA Intermediate ICAI',
    subjects: [
      {
        id: 'cainter_adv_accounting',
        name: 'Advanced Accounting',
        description: 'Paper 1: Accounting Standards (AS), Company Accounts, Buy-Back, Internal Reconstruction & Branch Accounting',
        iconName: 'Landmark',
        units: [
          {
            unitName: 'Unit 1: Applicable Accounting Standards (AS)',
            chapters: [
              'Applicability and Framework of Accounting Standards',
              'AS 1, 2, 3, 4, 5, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29'
            ]
          },
          {
            unitName: 'Unit 2: Special Company Accounts & Restructuring',
            chapters: [
              'Accounting for Employee Stock Option Plans (ESOP)',
              'Buy-Back of Securities & Equity Shares with Differential Rights',
              'Internal Reconstruction & Capital Reduction Scheme',
              'Amalgamation, Absorption & External Reconstruction (AS 14)'
            ]
          },
          {
            unitName: 'Unit 3: Consolidated & Branch Accounts',
            chapters: [
              'Financial Statements of Branches including Foreign Branches',
              'Preparation of Consolidated Financial Statements (AS 21, 23, 27)'
            ]
          }
        ],
        chapters: [
          'Applicability and Framework of Accounting Standards',
          'AS 1: Disclosure of Accounting Policies & AS 2: Valuation of Inventories',
          'AS 3: Cash Flow Statements & AS 4: Contingencies and Events Occurring After Balance Sheet Date',
          'AS 5: Net Profit or Loss for the Period, Prior Period Items and Changes in Accounting Policies',
          'AS 7: Construction Contracts & AS 9: Revenue Recognition',
          'AS 10: Property, Plant and Equipment (PPE)',
          'AS 11: The Effects of Changes in Foreign Exchange Rates',
          'AS 12: Accounting for Government Grants & AS 13: Accounting for Investments',
          'AS 14: Accounting for Amalgamations',
          'AS 15: Employee Benefits & AS 16: Borrowing Costs',
          'AS 17: Segment Reporting & AS 18: Related Party Disclosures',
          'AS 19: Leases & AS 20: Earnings Per Share (EPS)',
          'AS 21: Consolidated Financial Statements & AS 22: Accounting for Taxes on Income',
          'AS 23: Accounting for Investments in Associates & AS 24: Discontinuing Operations',
          'AS 25: Interim Financial Reporting & AS 26: Intangible Assets',
          'AS 27: Financial Reporting of Interests in Joint Ventures',
          'AS 28: Impairment of Assets & AS 29: Provisions, Contingent Liabilities and Contingent Assets',
          'Accounting for Employee Stock Option Plans (ESOP)',
          'Buy-Back of Securities and Equity Shares with Differential Rights',
          'Accounting for Internal Reconstruction & Capital Reduction Scheme',
          'Accounting for Amalgamation and Absorption of Companies',
          'Accounting for Branches including Foreign Branches',
          'Preparation of Consolidated Financial Statements (Single Subsidiary & Group Accounts)'
        ]
      },
      {
        id: 'cainter_corporate_other_laws',
        name: 'Corporate and Other Laws',
        description: 'Paper 2: The Companies Act, 2013 (Chapters I to XI) & The Limited Liability Partnership Act, 2008 & General Clauses Act & Interpretation of Statutes & FEMA',
        iconName: 'Scale',
        units: [
          {
            unitName: 'Part I: Company Law (The Companies Act, 2013 & LLP Act)',
            chapters: [
              'Preliminary & Incorporation of Company (Sec 1 to 22)',
              'Prospectus and Allotment of Securities (Sec 23 to 42)',
              'Share Capital and Debentures (Sec 43 to 72)',
              'Acceptance of Deposits by Companies (Sec 73 to 76A)',
              'Registration of Charges (Sec 77 to 87)',
              'Management and Administration - General Meetings & Annual Return (Sec 88 to 122)',
              'Declaration and Payment of Dividend (Sec 123 to 127)',
              'Accounts of Companies, CSR & Internal Audit (Sec 128 to 138)',
              'Audit and Auditors (Sec 139 to 148)',
              'Companies Incorporated Outside India (Foreign Companies - Sec 379 to 393A)',
              'The Limited Liability Partnership Act, 2008'
            ]
          },
          {
            unitName: 'Part II: Other Laws',
            chapters: [
              'The General Clauses Act, 1897',
              'Interpretation of Statutes (Rules of Interpretation, Internal & External Aids)',
              'The Foreign Exchange Management Act, 1999 (FEMA - Current & Capital Account Transactions)'
            ]
          }
        ],
        chapters: [
          'Preliminary & Incorporation of Company (Sec 1 to 22)',
          'Prospectus and Allotment of Securities (Sec 23 to 42)',
          'Share Capital and Debentures (Sec 43 to 72)',
          'Acceptance of Deposits by Companies (Sec 73 to 76A)',
          'Registration of Charges (Sec 77 to 87)',
          'Management and Administration: Annual General Meeting, EGM & Resolutions (Sec 88 to 122)',
          'Declaration and Payment of Dividend (Sec 123 to 127)',
          'Accounts of Companies, Corporate Social Responsibility (CSR) & Internal Audit (Sec 128 to 138)',
          'Audit and Auditors: Appointment, Rotation, Resignation & Disqualifications (Sec 139 to 148)',
          'Companies Incorporated Outside India (Foreign Companies - Sec 379 to 393A)',
          'The Limited Liability Partnership Act, 2008 (Incorporation, Partners, Conversion & Winding Up)',
          'The General Clauses Act, 1897: Definitions, Computation of Time & Powers',
          'Interpretation of Statutes: Primary Rules, Mischief Rule, Golden Rule & Aids to Construction',
          'The Foreign Exchange Management Act, 1999 (FEMA): Current vs Capital Account Transactions & Authorised Person'
        ]
      },
      {
        id: 'cainter_taxation',
        name: 'Taxation',
        description: 'Paper 3: Section A: Income-tax Law (50 Marks) & Section B: Goods and Services Tax (GST - 50 Marks)',
        iconName: 'Receipt',
        units: [
          {
            unitName: 'Section A: Income-tax Law (50 Marks)',
            chapters: [
              'Basic Concepts & Tax Rates (Default Sec 115BAC vs Normal Rates)',
              'Residential Status and Scope of Total Income (Sec 6 & Sec 5)',
              'Incomes which do not form part of Total Income (Exempt Incomes Sec 10)',
              'Salaries (Sec 15 to 17, Valuation of Perquisites & Allowances)',
              'Income from House Property (Sec 22 to 27, NAV & Deductions Sec 24)',
              'Profits and Gains of Business or Profession (PGBP - Sec 28 to 44DB)',
              'Capital Gains (Sec 45 to 55A, Exemptions Sec 54, 54B, 54EC, 54F)',
              'Income from Other Sources (Sec 56 to 59, Gifts Sec 56(2)(x))',
              'Clubbing of Income & Aggregation (Sec 60 to 69D)',
              'Set-off and Carry Forward of Losses (Sec 70 to 80)',
              'Deductions from Gross Total Income (Chapter VI-A: Sec 80C to 80U)',
              'Advance Tax, Tax Deduction at Source (TDS) & Tax Collection at Source (TCS)',
              'Filing of Return of Income & Self-Assessment (Sec 139)'
            ]
          },
          {
            unitName: 'Section B: Goods and Services Tax (GST - 50 Marks)',
            chapters: [
              'GST in India - An Introduction & Constitutional Framework',
              'Supply under GST (Sec 7 & Schedule I, II, III of CGST Act)',
              'Charge of GST & Reverse Charge Mechanism (RCM - Sec 9)',
              'Composition Levy (Sec 10 of CGST Act)',
              'Place of Supply (IGST Act Sec 10 to 13)',
              'Exemptions from GST (Mega Exemption Notifications)',
              'Time of Supply of Goods and Services (Sec 12 & Sec 13)',
              'Value of Supply (Sec 15 of CGST Act & Valuation Rules)',
              'Input Tax Credit (ITC - Sec 16, 17, 18 of CGST Act & Blocked Credits Sec 17(5))',
              'Registration under GST (Sec 22 to 30)',
              'Tax Invoice, Credit and Debit Notes & E-Way Bill (Sec 31 to 34 & Rule 138)',
              'Accounts and Records under GST (Sec 35 & 36)',
              'Payment of Tax (Sec 49, Electronic Cash/Credit/Liability Ledgers)'
            ]
          }
        ],
        chapters: [
          'Income Tax: Basic Concepts, Tax Rates & Section 115BAC Default Regime',
          'Income Tax: Residential Status and Scope of Total Income (Sec 6)',
          'Income Tax: Exempt Incomes under Section 10',
          'Income Tax: Salaries (Allowances, Perquisites & Deductions u/s 16)',
          'Income Tax: Income from House Property (Standard Deduction & Interest on Borrowed Capital)',
          'Income Tax: Profits and Gains of Business or Profession (PGBP, Depreciation Sec 32, Presumptive Taxation Sec 44AD/44ADA)',
          'Income Tax: Capital Gains (Indexed Cost, Special Rates Sec 111A/112A, Exemptions Sec 54)',
          'Income Tax: Income from Other Sources (Dividends, Deemed Dividends, Gifts Sec 56(2)(x))',
          'Income Tax: Clubbing of Income & Aggregation (Sec 60 to 65)',
          'Income Tax: Set-off and Carry Forward of Losses (Inter-source & Inter-head Restrictions)',
          'Income Tax: Deductions from GTI (Chapter VI-A: Sec 80C, 80CCD, 80D, 80G, 80JJAA)',
          'Income Tax: Computation of Total Income and Tax Payable of Individuals',
          'Income Tax: TDS, TCS and Advance Tax Provisions',
          'Income Tax: Filing of Return of Income (Sec 139, Updated Return Sec 139(8A))',
          'GST: Supply under GST (Sec 7, Schedule I, II, III)',
          'GST: Charge of GST, Forward Charge & Reverse Charge Mechanism (RCM u/s 9(3)/9(4))',
          'GST: Composition Levy (Sec 10 Eligibility, Rates & Restrictions)',
          'GST: Place of Supply for Goods and Services (IGST Act Sec 10 to 13)',
          'GST: Exemptions from GST (Healthcare, Education, Agriculture & Transport)',
          'GST: Time of Supply (Sec 12 for Goods, Sec 13 for Services)',
          'GST: Value of Supply (Transaction Value Sec 15 & Mandatory Inclusions/Discounts)',
          'GST: Input Tax Credit (ITC Sec 16 Eligibility, Apportionment Sec 17 & Blocked Credits Sec 17(5))',
          'GST: Registration (Thresholds Sec 22/24, Compulsory Registration & Procedure Sec 25)',
          'GST: Tax Invoice, Credit/Debit Notes, E-Invoicing & E-Way Bill',
          'GST: Payment of Tax & Electronic Ledgers (Rule 86A/86B)'
        ]
      },
      {
        id: 'cainter_cost_management',
        name: 'Cost and Management Accounting',
        description: 'Paper 4: Material, Labour, Overheads, Activity Based Costing (ABC), Cost Sheet, Standard Costing, Marginal Costing & Budgetary Control',
        iconName: 'Calculator',
        units: [
          {
            unitName: 'Unit 1: Elements of Cost and Cost Sheet',
            chapters: [
              'Introduction to Cost and Management Accounting',
              'Material Cost (EOQ, Stock Levels, Pricing of Issues, ABC Analysis)',
              'Employee Cost / Labour (Halsey, Rowan, Idle Time & Labour Turnover)',
              'Overheads: Absorption Costing Method (Allocation, Apportionment, Under/Over Absorption)'
            ]
          },
          {
            unitName: 'Unit 2: Modern Costing & Methods',
            chapters: [
              'Activity Based Costing (ABC - Cost Drivers & Cost Pools)',
              'Cost Sheet (Preparation as per CAS, Prime Cost, Factory Cost, Cost of Production)',
              'Unit & Batch Costing and Job Costing',
              'Contract Costing (Escalation Clause & Contract Accounts)',
              'Process & Operation Costing (Normal/Abnormal Loss, Equivalent Production)',
              'Joint Products and By Products (Net Realisable Value, Physical Units, Sales Value)'
            ]
          },
          {
            unitName: 'Unit 3: Decision Making Tools & Control',
            chapters: [
              'Service Costing / Operating Costing (Transport, Hospital, Hotel, IT)',
              'Standard Costing (Material, Labour & Overhead Variances)',
              'Marginal Costing (CVP Analysis, Break-Even Point, P/V Ratio, Margin of Safety, Key Factor)',
              'Budget and Budgetary Control (Flexible Budget, Cash Budget, Zero-Based Budgeting)'
            ]
          }
        ],
        chapters: [
          'Introduction to Cost and Management Accounting & Cost Concepts',
          'Material Cost: Economic Order Quantity (EOQ), Re-order Levels & Inventory Valuation',
          'Employee Cost / Labour: Halsey & Rowan Incentive Schemes, Labour Turnover & Idle Time',
          'Overheads: Primary & Secondary Apportionment, Machine Hour Rate & Under/Over Absorption',
          'Activity Based Costing (ABC): Identification of Cost Drivers and Cost Pools',
          'Cost Sheet: Preparation according to Cost Accounting Standards (CAS)',
          'Unit & Batch Costing (Economic Batch Quantity - EBQ)',
          'Job Costing and Contract Costing (Work Certified, Uncertified & Escalation Clause)',
          'Process Costing: Equivalent Production Units, Normal & Abnormal Losses/Gains',
          'Joint Products and By-Products: Apportionment of Joint Costs',
          'Service Costing: Cost per Passenger-KM, Room-Day & Patient-Day',
          'Standard Costing: Material Cost Variances & Labour Cost Variances',
          'Standard Costing: Variable & Fixed Overhead Variances',
          'Marginal Costing: Cost-Volume-Profit (CVP) Analysis, BEP, P/V Ratio & Margin of Safety',
          'Marginal Costing: Short-Term Decision Making (Make or Buy, Export Order, Key Factor)',
          'Budget and Budgetary Control: Flexible Budgets, Cash Budgets & Functional Budgets'
        ]
      },
      {
        id: 'cainter_auditing_ethics',
        name: 'Auditing and Ethics',
        description: 'Paper 5: Standards on Auditing (SAs), Audit Strategy & Planning, Internal Control, Audit Procedures, Audit Report & Code of Ethics',
        iconName: 'ShieldCheck',
        units: [
          {
            unitName: 'Unit 1: Nature of Audit, Strategy & SAs Framework',
            chapters: [
              'Nature, Objective and Scope of Audit (SA 200, SA 210, SA 220, SQC 1)',
              'Audit Strategy, Audit Planning and Audit Programme (SA 300)',
              'Risk Assessment and Internal Control (SA 315, SA 330, IT Controls)',
              'Audit Evidence (SA 500, SA 501, SA 505 External Confirmations, SA 510, SA 520, SA 530, SA 550)'
            ]
          },
          {
            unitName: 'Unit 2: Audit Execution & Completion',
            chapters: [
              'Audit of Items of Financial Statements (Substantive Testing of Balance Sheet & P&L Items)',
              'Audit Documentation and Audit Evidence (SA 230)',
              'Completion and Review (SA 560 Subsequent Events, SA 570 Going Concern, SA 580 Written Representations)'
            ]
          },
          {
            unitName: 'Unit 3: Reporting, Company Audit & Ethics',
            chapters: [
              'Audit Report (SA 700, 701 Key Audit Matters, 705 Modifications, 706 EOM/OM Paras)',
              'Special Features of Audit of Different Types of Entities (Bank Audit, Government Audit, Cooperative Societies)',
              'Audit of Companies (CARO 2020 Clauses, Sec 139 to 148 of Companies Act 2013)',
              'Ethics and Terms of Audit Engagements (ICAI Code of Ethics, Independence of Auditors)'
            ]
          }
        ],
        chapters: [
          'Nature, Objective and Scope of Audit (SA 200 Overall Objectives, SQC 1)',
          'Audit Strategy, Audit Planning and Audit Programme (SA 300)',
          'Risk Assessment and Internal Control (SA 315 Identifying & Assessing RMM, Internal Check)',
          'Audit Evidence (SA 500 Relevance & Reliability, SA 501 Specific Items, SA 505 External Confirmations)',
          'Audit Sampling (SA 530 Sampling Risk, Tolerable Error) & Analytical Procedures (SA 520)',
          'Audit Documentation (SA 230 Working Papers, Ownership & Retention)',
          'Fraud and Auditor Responsibilities (SA 240 Fraud Risk Factors & Fraud Reporting Sec 143(12))',
          'Audit of Items of Financial Statements: Share Capital, Reserves, Borrowings, PPE, Inventories, Trade Receivables/Payables, Sales & Purchases',
          'Specialised Audits: Audit of Banks, Government Audit (C&AG Role) & Cooperative Societies',
          'Audit of Companies: Qualifications, Disqualifications (Sec 141), Appointment, Removal & Reporting under Sec 143',
          'CARO 2020: Companies (Auditor\'s Report) Order, 2020 Detailed Clause Analysis',
          'Audit Report: Unmodified vs Modified Opinions (SA 700, SA 705), Key Audit Matters (SA 701)',
          'Emphasis of Matter & Other Matter Paragraphs (SA 706)',
          'Subsequent Events (SA 560), Going Concern (SA 570) & Written Representations (SA 580)',
          'Ethics and Quality Management (ICAI Code of Ethics, Fundamental Principles, Safeguards & Threats to Independence)'
        ]
      },
      {
        id: 'cainter_fm_sm',
        name: 'Financial Management and Strategic Management',
        description: 'Paper 6: Section A: Financial Management (50 Marks) & Section B: Strategic Management (50 Marks)',
        iconName: 'TrendingUp',
        units: [
          {
            unitName: 'Section A: Financial Management (50 Marks)',
            chapters: [
              'Scope and Objectives of Financial Management',
              'Types of Financing (Sources of Finance)',
              'Financial Analysis and Planning - Ratio Analysis',
              'Cost of Capital (Ke, Kd, Kp, Ko & WACC, CAPM Model)',
              'Financing Decisions - Capital Structure (Theories: Net Income, NOI, MM Approach & Arbitrage)',
              'Financing Decisions - Leverages (Operating, Financial & Combined Leverage, EBIT-EPS Analysis)',
              'Investment Decisions - Capital Budgeting (NPV, IRR, MIRR, Payback, Profitability Index)',
              'Dividend Decisions (Walter, Gordon & Modigliani-Miller Models)',
              'Management of Working Capital (Treasury, Cash, Inventory, Receivables Management & Factoring)'
            ]
          },
          {
            unitName: 'Section B: Strategic Management (50 Marks)',
            chapters: [
              'Introduction to Strategic Management (Vision, Mission, Objectives & Strategic Levels)',
              'Strategic Analysis: External Environment (PESTLE, Porter\'s Five Forces, Strategic Group Mapping)',
              'Strategic Analysis: Internal Environment (VRIO, Value Chain Analysis, SWOT / TOWS Matrix)',
              'Strategic Choices: Corporate Level Strategies (Growth, Stability, Retrenchment & Diversification)',
              'Strategic Choices: Business Level Strategies (Porter\'s Generic Strategies - Cost Leadership, Differentiation, Focus)',
              'Strategy Implementation and Control (Structure, Strategic Leadership, Digital Transformation & Benchmarking)'
            ]
          }
        ],
        chapters: [
          'FM: Scope and Objectives of Financial Management (Profit vs Wealth Maximisation)',
          'FM: Types of Financing (Long term, Medium term & Short term, Venture Capital, Lease)',
          'FM: Financial Analysis and Planning - Ratio Analysis (Liquidity, Leverage, Profitability & Turnover)',
          'FM: Cost of Capital (Cost of Debt, Equity, Preference & WACC using Book/Market Value weights)',
          'FM: Capital Structure Theories (Net Income, Net Operating Income, Traditional & Modigliani-Miller Theorem with/without Tax)',
          'FM: Leverages (Operating, Financial and Combined Leverage, Indifference Point & Financial Break-even)',
          'FM: Investment Decisions - Capital Budgeting (NPV, IRR, Payback, Discounted Payback, PI & Replacement Decisions)',
          'FM: Dividend Decisions (Walter\'s Model, Gordon\'s Model, Modigliani-Miller Dividend Irrelevance)',
          'FM: Working Capital Management (Operating Cycle, Cash Management Baumol/Miller-Orr, Receivables Aging & Factoring)',
          'SM: Introduction to Strategic Management, Strategic Intent, Vision, Mission & Goals',
          'SM: Strategic Analysis: External Environmental Analysis (PESTLE & Porter\'s 5 Forces Model)',
          'SM: Strategic Analysis: Internal Capabilities (Value Chain Analysis, VRIO Framework, SWOT/TOWS Matrix, BCG Matrix, Ansoff Matrix)',
          'SM: Corporate Level Strategies: Stability, Expansion/Growth, Retrenchment, Turnaround & Combinations',
          'SM: Business Level Strategies: Michael Porter\'s Generic Competitive Strategies',
          'SM: Functional Strategies: Marketing, Financial, Operations, R&D and HR Strategies',
          'SM: Strategy Implementation and Evaluation: Matrix Structure, Strategic Leadership, Corporate Culture & Strategic Control'
        ]
      }
    ]
  },

  NEET: {
    id: 'NEET',
    title: 'NEET (UG) - Medical Entrance',
    subtitle: 'National Eligibility cum Entrance Test (NTA / NMC Medical Curriculum)',
    badge: 'NTA NEET (UG)',
    defaultLevel: 'NEET (UG) Medical',
    subjects: [
      {
        id: 'neet_physics',
        name: 'Physics',
        description: 'Mechanics, Electrodynamics, Optics, Thermodynamics, Modern Physics & Experimental Physics',
        iconName: 'Zap',
        units: [
          {
            unitName: 'Unit 1: Mechanics & Gravitation',
            chapters: [
              'Units and Measurements (Errors, Dimensions & Vernier/Screw Gauge)',
              'Motion in a Straight Line & Motion in a Plane (Vectors & Projectile)',
              'Laws of Motion & Friction (Newton\'s Laws, Impulse & Circular Motion)',
              'Work, Energy and Power (Work-Energy Theorem, Conservative Forces & Collisions)',
              'System of Particles and Rotational Motion (Centre of Mass, Torque & Moment of Inertia)',
              'Gravitation (Kepler\'s Laws, Acceleration due to Gravity & Escape Velocity)'
            ]
          },
          {
            unitName: 'Unit 2: Properties of Matter, Thermodynamics & Oscillations',
            chapters: [
              'Mechanical Properties of Solids & Fluids (Hooke\'s Law, Viscosity & Bernoulli\'s Theorem)',
              'Thermal Properties of Matter & Thermodynamics (Heat Transfer, 1st & 2nd Law of Thermodynamics)',
              'Kinetic Theory of Gases (RMS Velocity, Degrees of Freedom & Law of Equipartition)',
              'Oscillations and Waves (Simple Harmonic Motion, Wave Speed & Doppler Effect/Beats)'
            ]
          },
          {
            unitName: 'Unit 3: Electrodynamics & Magnetism',
            chapters: [
              'Electrostatics (Coulomb\'s Law, Gauss\'s Theorem, Potential & Capacitance)',
              'Current Electricity (Ohm\'s Law, Kirchhoff\'s Rules & Wheatstone Bridge)',
              'Magnetic Effects of Current and Magnetism (Biot-Savart Law, Ampere\'s Law & Magnetic Dipole)',
              'Electromagnetic Induction and Alternating Currents (Faraday\'s Law, Lenz\'s Law, LCR Circuits & Transformers)',
              'Electromagnetic Waves (Characteristics & EM Spectrum)'
            ]
          },
          {
            unitName: 'Unit 4: Optics, Modern Physics & Semiconductors',
            chapters: [
              'Ray Optics and Optical Instruments (Refraction, Total Internal Reflection, Lenses & Microscope/Telescope)',
              'Wave Optics (Huygens\' Principle, Young\'s Double Slit Interference & Diffraction)',
              'Dual Nature of Radiation and Matter (Photoelectric Effect & de Broglie Wavelength)',
              'Atoms and Nuclei (Bohr Model, Radioactivity, Mass Defect & Nuclear Binding Energy)',
              'Semiconductor Electronics (p-n Junction Diode, Rectifiers & Logic Gates)'
            ]
          }
        ],
        chapters: [
          'Units and Measurements (Dimensions, Significant Figures & Error Analysis)',
          'Motion in a Straight Line (Kinematic Equations & Graphs)',
          'Motion in a Plane (Vectors, Relative Velocity & Projectile Motion)',
          'Laws of Motion (Newton\'s Laws, Momentum, Friction & Banking of Roads)',
          'Work, Energy and Power (Kinetic/Potential Energy, Work-Energy Theorem & Collisions)',
          'System of Particles and Rotational Motion (Moment of Inertia, Conservation of Angular Momentum)',
          'Gravitation (Universal Law, Gravitational Potential & Orbital Velocity)',
          'Mechanical Properties of Solids (Stress-Strain Curve & Young\'s Modulus)',
          'Mechanical Properties of Fluids (Pascal\'s Law, Archimedes, Surface Tension & Viscosity)',
          'Thermal Properties of Matter (Calorimetry, Thermal Expansion & Conduction/Radiation)',
          'Thermodynamics (Zeroth, First & Second Laws, Carnot Engine & Refrigerators)',
          'Kinetic Theory of Gases (Gas Laws, Pressure Formula & Degrees of Freedom)',
          'Oscillations (Simple Harmonic Motion, Spring-Block & Simple Pendulum)',
          'Waves (Longitudinal & Transverse Waves, Speed of Sound, Beats & Resonance)',
          'Electric Charges and Fields (Coulomb\'s Law, Electric Field Lines & Gauss\'s Law)',
          'Electrostatic Potential and Capacitance (Capacitors in Series/Parallel & Dielectrics)',
          'Current Electricity (Drift Velocity, Resistance, Kirchhoff\'s Laws & Meter Bridge)',
          'Moving Charges and Magnetism (Lorentz Force, Cyclotron, Biot-Savart & Solenoid)',
          'Magnetism and Matter (Bar Magnet, Earth\'s Magnetism, Dia/Para/Ferromagnetism)',
          'Electromagnetic Induction (Faraday\'s & Lenz\'s Laws, Self & Mutual Inductance)',
          'Alternating Current (Peak/RMS Values, Phasor Diagrams, Resonance in Series LCR)',
          'Electromagnetic Waves (Displacement Current & EM Spectrum Applications)',
          'Ray Optics and Optical Instruments (Mirror/Lens Formula, Prism & Refraction)',
          'Wave Optics (Interference of Light, YDSE Fringe Width & Single Slit Diffraction)',
          'Dual Nature of Matter and Radiation (Einstein\'s Photoelectric Equation)',
          'Atoms (Rutherford & Bohr Models of Hydrogen Atom, Spectral Lines)',
          'Nuclei (Nuclear Size, Binding Energy per Nucleon, Fission & Fusion)',
          'Semiconductor Electronics (p-n Junction Diodes, Zener Diode, Half/Full Wave Rectifiers)'
        ]
      },
      {
        id: 'neet_chemistry',
        name: 'Chemistry',
        description: 'Physical Chemistry, Inorganic Chemistry & Organic Chemistry (NMC NEET Pattern)',
        iconName: 'Atom',
        units: [
          {
            unitName: 'Section A: Physical Chemistry',
            chapters: [
              'Some Basic Concepts of Chemistry (Mole Concept, Stoichiometry & Concentration Terms)',
              'Structure of Atom (Bohr\'s Model, Quantum Numbers & Aufbau Principle)',
              'Chemical Thermodynamics (First & Second Laws, Enthalpy, Entropy & Gibbs Free Energy)',
              'Chemical & Ionic Equilibrium (Le Chatelier\'s Principle, pH, Buffer Solutions & Solubility Product)',
              'Redox Reactions and Electrochemistry (Nernst Equation, Galvanic Cells & Kohlrausch\'s Law)',
              'Solutions (Raoult\'s Law, Colligative Properties & Van\'t Hoff Factor)',
              'Chemical Kinetics (Rate Law, Order/Molecularity, Arrhenius Equation & Activation Energy)'
            ]
          },
          {
            unitName: 'Section B: Inorganic Chemistry',
            chapters: [
              'Classification of Elements and Periodicity in Properties (Periodic Trends)',
              'Chemical Bonding and Molecular Structure (VSEPR Theory, Hybridisation & MOT)',
              'p-Block Elements (Group 13 to 18 Trends and Key Compounds)',
              'd- and f-Block Elements (Lanthanoid Contraction, Transition Metal Properties)',
              'Coordination Compounds (Werner\'s Theory, IUPAC Nomenclature, CFT & Isomerism)'
            ]
          },
          {
            unitName: 'Section C: Organic Chemistry',
            chapters: [
              'Purification and Organic Chemistry: Basic Principles & Techniques (GOC, Inductive/Mesomeric Effects & Hyperconjugation)',
              'Hydrocarbons (Alkanes, Alkenes, Alkynes & Aromatic Electrophilic Substitution)',
              'Haloalkanes and Haloarenes (SN1, SN2 Mechanisms & Elimination Reactions)',
              'Alcohols, Phenols and Ethers (Acidity of Phenols, Preparation & Williamson Synthesis)',
              'Aldehydes, Ketones and Carboxylic Acids (Nucleophilic Addition, Aldol & Cannizzaro Reactions)',
              'Amines / Organic Compounds Containing Nitrogen (Basicity, Diazonium Salts & Carbylamine Test)',
              'Biomolecules (Carbohydrates, Amino Acids, Proteins, Nucleic Acids & Vitamins)',
              'Principles Related to Practical Chemistry (Salt Analysis & Functional Group Tests)'
            ]
          }
        ],
        chapters: [
          'Some Basic Concepts of Chemistry: Mole Concept, Empirical Formula & Molarity/Molality',
          'Structure of Atom: Bohr Model, Photoelectric, de Broglie & Quantum Numbers',
          'Chemical Thermodynamics: Enthalpy Changes, Hess\'s Law, Entropy & ΔG = ΔH - TΔS',
          'Equilibrium: Kc/Kp, Le Chatelier\'s Principle, Ostwald Dilution & Common Ion Effect',
          'Ionic Equilibrium: pH Calculations, Buffer Solutions & Ksp Precipitation',
          'Solutions: Henry\'s Law, Raoult\'s Law, Osmotic Pressure & Van\'t Hoff Factor',
          'Electrochemistry: Standard Electrode Potential, Nernst Equation & Kohlrausch\'s Law',
          'Chemical Kinetics: Rate Expressions, Integrated Rate Laws (Zero/First Order) & Half-Life',
          'Redox Reactions: Oxidation Number Rules & Balancing Redox Equations',
          'Classification of Elements and Periodicity: Atomic/Ionic Radii, Ionization Enthalpy & Electron Gain Enthalpy',
          'Chemical Bonding and Molecular Structure: Octet Rule, VSEPR Geometry, Hybridisation & Molecular Orbital Theory',
          'p-Block Elements: Anomalous Properties, Trends, Oxoacids of Halogens/Nitrogen/Phosphorus',
          'd- and f-Block Elements: Electronic Configurations, Magnetic Properties, Catalytic Action & Lanthanoid Contraction',
          'Coordination Compounds: IUPAC Naming, Werner\'s Theory, Crystal Field Theory (CFT) & Isomerism',
          'Organic Chemistry: General Organic Chemistry (GOC), Resonance, Inductive Effect & Stability of Intermediates',
          'Hydrocarbons: Markovnikov\'s Rule, Anti-Markovnikov, Friedel-Crafts Alkylation/Acylation & Aromaticity',
          'Haloalkanes and Haloarenes: Nucleophilic Substitution (SN1 vs SN2 Mechanisms) & Saytzeff Rule',
          'Alcohols, Phenols and Ethers: Lucas Reagent, Reimer-Tiemann Reaction, Kolbe\'s Reaction & Williamson Synthesis',
          'Aldehydes and Ketones: Nucleophilic Addition, Fehling/Tollens Tests, Aldol Condensation & Cannizzaro Reaction',
          'Carboxylic Acids: Acid Strength, Decarboxylation & HVZ Reaction',
          'Amines: Gabriel Phthalimide Synthesis, Hoffmann Bromamide Degradation & Hinsberg Test',
          'Biomolecules: Monosaccharides (Glucose/Fructose), Peptide Bonds, Denaturation of Proteins & DNA/RNA'
        ]
      },
      {
        id: 'neet_biology',
        name: 'Biology',
        description: 'Botany & Zoology: NCERT Line-by-Line Concepts, Diagrams, Human Physiology, Genetics & Ecology',
        iconName: 'Dna',
        units: [
          {
            unitName: 'Unit 1: Diversity & Structural Organisation',
            chapters: [
              'The Living World (Binomial Nomenclature, Taxonomic Categories)',
              'Biological Classification (Five Kingdom Classification, Monera, Protista, Fungi, Viruses)',
              'Plant Kingdom (Algae, Bryophytes, Pteridophytes, Gymnosperms & Angiosperms)',
              'Animal Kingdom (Non-Chordates and Chordates Salient Features)',
              'Morphology of Flowering Plants (Root, Stem, Leaf, Inflorescence, Flower & Fruit)',
              'Anatomy of Flowering Plants (Tissues, Monocot/Dicot Stem & Root Anatomy)',
              'Structural Organisation in Animals (Animal Tissues & Morphology/Anatomy of Frog)'
            ]
          },
          {
            unitName: 'Unit 2: Cell Biology, Biomolecules & Plant Physiology',
            chapters: [
              'Cell: The Unit of Life (Prokaryotic vs Eukaryotic Cell, Organelles & Endomembrane System)',
              'Biomolecules (Proteins, Carbohydrates, Lipids, Nucleic Acids & Enzyme Kinetics)',
              'Cell Cycle and Cell Division (Mitosis, Meiosis, Stages & Significance)',
              'Photosynthesis in Higher Plants (Light Reaction, Calvin Cycle, C4 Pathway & Factors)',
              'Respiration in Plants (Glycolysis, Fermentation, Krebs Cycle & ETS/Oxidative Phosphorylation)',
              'Plant Growth and Development (Phytohormones: Auxin, Gibberellin, Cytokinin, ABA, Ethylene)'
            ]
          },
          {
            unitName: 'Unit 3: Human Physiology',
            chapters: [
              'Breathing and Exchange of Gases (Respiratory Volumes, Capacities & Gas Transport)',
              'Body Fluids and Circulation (Blood Groups, Cardiac Cycle, ECG & Double Circulation)',
              'Excretory Products and their Elimination (Nephron, Urine Formation & RAAS Mechanism)',
              'Locomotion and Movement (Types of Muscles, Sliding Filament Theory & Skeletal System/Joints)',
              'Neural Control and Coordination (Neuron, Nerve Impulse Generation, Synapse & Sensory Organs)',
              'Chemical Coordination and Integration (Endocrine Glands, Hormones & Mechanism of Hormone Action)'
            ]
          },
          {
            unitName: 'Unit 4: Reproduction, Genetics, Evolution & Ecology',
            chapters: [
              'Sexual Reproduction in Flowering Plants (Pollination, Double Fertilization, Endosperm & Embryo)',
              'Human Reproduction (Male/Female Reproductive Systems, Gametogenesis, Menstrual Cycle & Embryonic Development)',
              'Reproductive Health (Contraceptive Methods, Medical Termination of Pregnancy & ART: IVF, ZIFT, ICSI)',
              'Principles of Inheritance and Variation (Mendelian Genetics, Linkage, Sex Determination & Genetic Disorders)',
              'Molecular Basis of Inheritance (DNA Structure, Replication, Transcription, Genetic Code, Translation & Lac Operon)',
              'Evolution (Origin of Life, Darwinism, Hardy-Weinberg Principle & Human Evolution)',
              'Human Health and Disease (Common Infectious Diseases, Immunity, AIDS, Cancer & Drugs/Alcohol Abuse)',
              'Microbes in Human Welfare (Sewage Treatment, Biogas, Biofertilisers & Biocontrol Agents)',
              'Biotechnology: Principles and Processes (Recombinant DNA Technology, PCR & Gel Electrophoresis)',
              'Biotechnology and its Applications (Bt Cotton, Gene Therapy, RNAi & Transgenic Animals)',
              'Organisms and Populations (Adaptations, Population Attributes & Interactions)',
              'Ecosystem (Trophic Levels, Energy Flow, Ecological Pyramids & Productivity)',
              'Biodiversity and its Conservation (Levels of Biodiversity, Loss of Biodiversity & Hotspots)'
            ]
          }
        ],
        chapters: [
          'The Living World (Characteristics of Life, Binomial Nomenclature)',
          'Biological Classification (Monera, Protista, Fungi, Viruses, Viroids & Lichens)',
          'Plant Kingdom (Algae, Bryophytes, Pteridophytes, Gymnosperms & Angiosperms Life Cycles)',
          'Animal Kingdom (Porifera to Chordata: Key Diagnostic Features & Examples)',
          'Morphology of Flowering Plants (Root, Stem, Leaf Modifications, Inflorescence & Flower Parts)',
          'Anatomy of Flowering Plants (Meristematic & Permanent Tissues, Vascular Bundles, Secondary Growth)',
          'Structural Organisation in Animals (Epithelial, Connective, Muscular Tissues & Frog Anatomy)',
          'Cell: The Unit of Life (Cell Wall, Plasma Membrane Fluid Mosaic Model, Organelles & Nucleus)',
          'Biomolecules (Amino Acids, Enzymes - Michaelis Menten, Factors Affecting Enzyme Activity)',
          'Cell Cycle and Cell Division (Phases of Cell Cycle, Mitosis & Meiosis I/II Crossing Over)',
          'Photosynthesis in Higher Plants (Pigments, Cyclic/Non-cyclic Photophosphorylation, C3 & C4 Cycles)',
          'Respiration in Plants (Glycolysis, Citric Acid Cycle / Krebs Cycle, Electron Transport Chain)',
          'Plant Growth and Development (Auxins, Gibberellins, Cytokinins, Ethylene & Abscisic Acid)',
          'Breathing and Exchange of Gases (Tidal Volume, Vital Capacity, Oxygen-Haemoglobin Curve)',
          'Body Fluids and Circulation (Blood Composition, Cardiac Cycle, ECG Interpretation & Blood Pressure)',
          'Excretory Products and their Elimination (Structure of Nephron, Counter-Current Mechanism & Regulation by ADH/RAAS)',
          'Locomotion and Movement (Sarcomere Structure, Sliding Filament Theory, Joints & Disorders)',
          'Neural Control and Coordination (Action Potential Propagation, Chemical Synapse & Reflex Action)',
          'Chemical Coordination and Integration (Pituitary, Thyroid, Adrenal, Pancreas Hormones & Mechanism)',
          'Sexual Reproduction in Flowering Plants (Microsporogenesis, Megasporogenesis, Double Fertilization & Apomixis)',
          'Human Reproduction (Spermatogenesis, Oogenesis, Menstrual Cycle Hormonal Regulation & Implantation)',
          'Reproductive Health (Contraception Methods, Amniocentesis, Infertility & Assisted Reproductive Technologies)',
          'Principles of Inheritance and Variation (Mendel\'s Laws, Incomplete Dominance, Co-dominance, Linkage, Pedigree Analysis & Chromosomal Disorders)',
          'Molecular Basis of Inheritance (DNA Double Helix, Meselson-Stahl Experiment, Transcription, Genetic Code, Translation & Lac Operon)',
          'Evolution (Homologous/Analogous Organs, Natural Selection, Hardy-Weinberg Equilibrium & Fossil Record)',
          'Human Health and Disease (Plasmodium Life Cycle, Typhoid, Pneumonia, Active/Passive Immunity, Autoimmunity, HIV/AIDS & Cancer)',
          'Microbes in Human Welfare (Fermenters, Antibiotics, Sewage Treatment Plant STP & Biogas Production)',
          'Biotechnology: Principles and Processes (Restriction Enzymes, Cloning Vectors pBR322, PCR & Agarose Gel Electrophoresis)',
          'Biotechnology and its Applications (Genetically Modified Crops Bt Cotton, Pest Resistant Tobacco, Humulin & Gene Therapy in ADA Deficiency)',
          'Organisms and Populations (Abiotic Factors, Ecological Adaptations, Population Growth Curves & Interspecific Interactions)',
          'Ecosystem (Primary & Secondary Productivity, Decomposition, Food Chains, Ecological Pyramids)',
          'Biodiversity and Conservation (Species-Area Relationship, In-situ vs Ex-situ Conservation & Sacred Groves)'
        ]
      }
    ]
  },

  JEE: {
    id: 'JEE',
    title: 'JEE (Main & Advanced) - Engineering',
    subtitle: 'Joint Entrance Examination (NTA JEE Main & IIT JEE Advanced Curriculum)',
    badge: 'IIT JEE / NTA',
    defaultLevel: 'JEE Main & Advanced',
    subjects: [
      {
        id: 'jee_physics',
        name: 'Physics',
        description: 'Advanced Mechanics, Electromagnetism, Wave & Ray Optics, Thermodynamics, Modern Physics',
        iconName: 'Zap',
        units: [
          {
            unitName: 'Unit 1: Classical Mechanics & Gravitation',
            chapters: [
              'Units, Dimensions and Errors (Dimensional Analysis & Calculus in Kinematics)',
              'Kinematics (Rectilinear Motion, Relative Motion in 2D & Projectile on Incline)',
              'Laws of Motion (Constraint Relations, Pseudo Forces & Variable Mass Systems)',
              'Work, Power and Energy (Conservative Fields, Potential Energy Curves & Collisions in 2D)',
              'Centre of Mass & System of Particles (Momentum Conservation & Rocket Propulsion)',
              'Rotational Dynamics (Torque, Moment of Inertia, Pure Rolling & Angular Momentum Conservation)',
              'Gravitation (Gravitational Potential & Field of Continuous Bodies, Satellite Orbits & Kepler\'s Laws)'
            ]
          },
          {
            unitName: 'Unit 2: Fluid Mechanics, Thermal Physics & Waves',
            chapters: [
              'Fluid Statics & Dynamics (Equation of Continuity, Bernoulli\'s Theorem, Surface Tension & Viscosity/Poiseuille)',
              'Elasticity and Thermal Expansion (Stress-Strain Curve & Thermal Stress)',
              'Thermodynamics and Kinetic Theory (P-V/T-S Diagrams, Cyclic Processes, Polytropic Processes & Heat Engines)',
              'Simple Harmonic Motion (Linear and Angular SHM, Damped and Forced Oscillations)',
              'Wave Motion and Sound Waves (Wave Equation, Interference, Standing Waves in Strings/Pipes & Doppler Effect)'
            ]
          },
          {
            unitName: 'Unit 3: Electrodynamics & Magnetism',
            chapters: [
              'Electrostatics (Gauss\'s Law Applications, Conductors in Electrostatic Equilibrium & Electric Dipoles)',
              'Capacitance (Dielectrics, Force on Plates, Energy Density & RC Circuit Transients)',
              'Current Electricity (Kirchhoff\'s Laws, Symmetry Methods, Potentiometer & RC/LR Circuits)',
              'Magnetic Effects of Current (Biot-Savart Law, Ampere\'s Circuital Law & Magnetic Force on Conductors/Charges)',
              'Electromagnetic Induction (Motional EMF, Faraday-Lenz Laws, Self/Mutual Inductance & LR Circuit Transients)',
              'Alternating Current (Phasor Analysis, Resonance in LCR Circuits, Power Factor & LC Oscillations)'
            ]
          },
          {
            unitName: 'Unit 4: Optics, Modern Physics & Experimental Physics',
            chapters: [
              'Geometrical Optics (Reflection, Refraction at Curved Surfaces, Lens-Maker\'s Formula, Prisms & Optical Systems)',
              'Wave Optics (Huygens\' Principle, Young\'s Double Slit Experiment with Thin Films, Single Slit Diffraction & Polarisation)',
              'Dual Nature of Matter and Radiation (Photoelectric Equation & Matter Waves)',
              'Atomic and Nuclear Physics (Bohr\'s Model, Hydrogen Spectrum, Nuclear Binding Energy, Q-Value, Alpha/Beta Decay & Fission)',
              'Experimental Physics and Error Analysis (Vernier Calipers, Screw Gauge, Sonometer, Resonance Tube & Meter Bridge)'
            ]
          }
        ],
        chapters: [
          'Kinematics in 1D and 2D (Graphs, Relative Velocity & River-Swimmer Problems)',
          'Newton\'s Laws of Motion and Friction (String Constraints, Wedge Constraints & Block-on-Block Friction)',
          'Work, Energy and Power (Work-Energy Theorem & Vertical Circular Motion)',
          'Rotational Motion (Rigid Body Dynamics, Moment of Inertia by Integration, Instantaneous Axis of Rotation & Pure Rolling)',
          'Gravitation (Field & Potential Calculations, Escape Velocity & Orbital Motion)',
          'Fluid Mechanics (Pascal\'s Law, Buoyancy, Hydrodynamics, Torricelli\'s Law & Terminal Velocity)',
          'Thermodynamics (First and Second Laws, Reversible/Irreversible Processes, Carnot Cycle & Heat Capacities Cp/Cv)',
          'Kinetic Theory of Gases (Maxwell-Boltzmann Speed Distribution & Degrees of Freedom)',
          'Simple Harmonic Motion (Superposition of SHMs & Torsional Pendulum)',
          'Waves and Sound (Doppler Effect with Moving Source and Observer & Beats)',
          'Electrostatics (Electric Potential of Continuous Charge Distributions & Gauss\'s Law)',
          'Capacitors (Dielectric Polarization, Energy Stored & RC Transient Charging/Discharging)',
          'Current Electricity (Nodal Analysis, Wheatstone Bridge, Meter Bridge & Potentiometer Applications)',
          'Magnetism and Moving Charges (Lorentz Force, Magnetic Dipole Moment & Ampere\'s Law)',
          'Electromagnetic Induction (Induced Electric Fields, Eddy Currents & Mutual Induction)',
          'Alternating Current (Series and Parallel LCR Resonance, Quality Factor & AC Power)',
          'Ray Optics (Total Internal Reflection, Spherical Mirrors, Lenses & Optical Aberrations)',
          'Wave Optics (Interference, Path Difference, Fringe Shift with Mica Sheet & Diffraction)',
          'Modern Physics: Dual Nature, Photoelectric Effect & de Broglie Wavelength',
          'Atoms and Nuclei (Bohr Postulates, X-Rays: Continuous and Characteristic & Radioactive Decay Law)',
          'Semiconductors and Logic Gates (p-n Junction, Zener Diodes, Transistor Basics & Truth Tables)'
        ]
      },
      {
        id: 'jee_chemistry',
        name: 'Chemistry',
        description: 'Physical Chemistry, Inorganic Coordination & Periodic Trends, Organic Reaction Mechanisms',
        iconName: 'Atom',
        units: [
          {
            unitName: 'Section A: Physical Chemistry',
            chapters: [
              'Mole Concept & Redox Stoichiometry (Equivalent Weight, Normality, Limiting Reagents & n-factor)',
              'Atomic Structure (Bohr Theory, de Broglie, Heisenberg Uncertainty, Quantum Numbers & Radial/Angular Wavefunctions)',
              'Chemical Thermodynamics & Energetics (First Law, Enthalpies of Reactions, Second/Third Laws, Gibbs Free Energy & Criteria for Spontaneity)',
              'Chemical & Ionic Equilibrium (Homogeneous/Heterogeneous Equilibrium, Le Chatelier\'s Principle, Buffer Solutions, Solubility Equilibria & Hydrolysis)',
              'Solid State & Solutions (Crystal Lattices, Defects, Raoult\'s Law, Colligative Properties & Abnormal Molar Mass)',
              'Electrochemistry (Nernst Equation, Galvanic/Electrolytic Cells, Kohlrausch\'s Law & Corrosion)',
              'Chemical Kinetics (Integrated Rate Laws, Collision Theory, Arrhenius Equation & Complex Reactions/Mechanisms)',
              'Surface Chemistry (Adsorption Isotherms, Catalysis & Colloids)'
            ]
          },
          {
            unitName: 'Section B: Inorganic Chemistry',
            chapters: [
              'Periodic Classification and Chemical Bonding (VSEPR, Hybridisation, MO Theory, Dipole Moments & Hydrogen Bonding)',
              'Coordination Compounds (IUPAC Nomenclature, Werner\'s Theory, Valence Bond Theory, Crystal Field Theory & Isomerism in Complexes)',
              'd- and f-Block Elements (Electronic Configuration, Oxidation States, Magnetic Moments, Catalytic Properties & Lanthanoid Contraction)',
              'p-Block Chemistry (Group 13 to 18 Elements, Structures of Oxoacids, Interhalogens, Xenon Compounds & Trends)',
              'Principles of Qualitative Salt Analysis (Cation and Anion Detection & Confirmatory Tests)'
            ]
          },
          {
            unitName: 'Section C: Organic Chemistry',
            chapters: [
              'General Organic Chemistry & Isomerism (Inductive, Resonance, Hyperconjugation, Aromaticity, Structural & Stereoisomerism)',
              'Hydrocarbons (Alkanes, Alkenes, Alkynes & Aromatic Electrophilic Substitution Mechanisms)',
              'Haloalkanes and Haloarenes (SN1, SN2, E1, E2 Mechanisms, Regioselectivity & Stereospecificity)',
              'Alcohols, Phenols and Ethers (Preparation, Grignard Reagent Reactions, Pinacol-Pinacolone, Kolbe & Reimer-Tiemann)',
              'Aldehydes, Ketones and Carboxylic Acids (Nucleophilic Additions, Aldol, Cannizzaro, Perkins, HVZ & Esterification)',
              'Organic Nitrogen Compounds (Amines, Diazonium Salts, Sandmeyer, Gabriel Phthalimide & Carbylamine Test)',
              'Biomolecules and Polymers (Carbohydrates, Amino Acids, Peptides, DNA/RNA & Synthetic Polymers)'
            ]
          }
        ],
        chapters: [
          'Mole Concept and Stoichiometry (Concentration Units, Equivalent Concept & Redox Titrations)',
          'Atomic Structure (Schrödinger Wave Equation, Radial Probability Distribution & Aufbau/Hund\'s Rule)',
          'Chemical Thermodynamics (Work in Isothermal/Adiabatic Processes, Hess\'s Law & Entropy Calculations)',
          'Chemical Equilibrium (Equilibrium Constants Kp/Kc/Kx & Reaction Quotient)',
          'Ionic Equilibrium (pH of Weak Acids/Bases, Salt Hydrolysis, Buffer Action & Ksp Calculations)',
          'Solutions and Colligative Properties (Relative Lowering of Vapor Pressure, Elevation in BP, Depression in FP & Osmosis)',
          'Electrochemistry (Standard Reduction Potentials, Nernst Equation, Faraday\'s Laws & Conductance)',
          'Chemical Kinetics (First Order Kinetics, Pseudo First Order, Arrhenius Activation Energy & Reaction Mechanisms)',
          'Chemical Bonding (Hybridisation sp/sp2/sp3/sp3d/sp3d2, Molecular Orbital Diagrams for B2, C2, N2, O2 & Bond Order)',
          'Coordination Chemistry (Crystal Field Splitting in Octahedral/Tetrahedral Complexes & Jahn-Teller Effect)',
          'd- and f-Block Elements (Transition Metal Chemistry, Potassium Permanganate & Potassium Dichromate Reactions)',
          'p-Block Elements (Borax, Diborane, Silicones, Silicates, Oxoacids of Phosphorus & Halogens)',
          'General Organic Chemistry (GOC: Carbocations, Carbanions, Free Radicals Stability & Acidity/Basicity Comparisons)',
          'Stereochemistry (Chirality, Enantiomers, Diastereomers, Meso Compounds, Optical Activity & R/S Configuration)',
          'Hydrocarbons (Markovnikov Addition, Ozonolysis, Hydroboration-Oxidation & Birch Reduction)',
          'Alkyl Halides (SN1 vs SN2 Substitution, E1 vs E2 Elimination & Saytzeff/Hoffmann Products)',
          'Oxygen Compounds (Aldol Condensation, Cannizzaro Reaction, Clemmensen/Wolff-Kishner Reduction & Haloform Test)',
          'Carboxylic Acids and Derivatives (Acid Derivatives Reactivity Order, Decarboxylation & HVZ Reaction)',
          'Amines and Diazonium Salts (Hoffmann Bromamide, Hinsberg Test, Diazotisation & Coupling Reactions)',
          'Biomolecules (Glucose/Fructose Mutarotation, Peptide Linkage, Proteins Secondary/Tertiary Structures)'
        ]
      },
      {
        id: 'jee_mathematics',
        name: 'Mathematics',
        description: 'Advanced Calculus, Linear Algebra & Matrices, Coordinate Geometry, Vectors & 3D, Probability',
        iconName: 'Calculator',
        units: [
          {
            unitName: 'Unit 1: Algebra & Complex Numbers',
            chapters: [
              'Sets, Relations and Functions (Domain, Range, Injective, Surjective & Composite Functions)',
              'Complex Numbers and Quadratic Equations (Argand Plane, Modulus-Argument, Roots of Unity, De Moivre\'s Theorem & Roots of Polynomials)',
              'Matrices and Determinants (Properties of Determinants, Adjoint, Inverse, System of Linear Equations & Cramer\'s Rule)',
              'Permutations and Combinations (Fundamental Principle, Circular Permutations, Combinations with Repetition & Inclusion-Exclusion)',
              'Binomial Theorem (General and Middle Terms, Properties of Binomial Coefficients & Multinomial Theorem)',
              'Sequences and Series (AP, GP, HP, Arithmetic-Geometric Progression (AGP) & Special Sums Σn, Σn², Σn³)'
            ]
          },
          {
            unitName: 'Unit 2: Trigonometry & Coordinate Geometry',
            chapters: [
              'Trigonometric Functions & Equations (Compound Angles, Multiple/Submultiple Angles, General Solutions & Heights and Distances)',
              'Inverse Trigonometric Functions (Principal Values, Properties & Sum/Difference of Angles)',
              'Straight Lines and Pair of Straight Lines (Slope-Intercept, Distance Formula, Angle Bisectors & Family of Lines)',
              'Circle (Standard & General Form, Tangents and Normals, Orthogonality & Radical Axis)',
              'Conic Sections - Parabola (Standard Equation, Focal Chord, Tangents, Normals & Reflection Property)',
              'Conic Sections - Ellipse and Hyperbola (Eccentricity, Directrices, Foci, Tangents, Normals & Asymptotes of Hyperbola)'
            ]
          },
          {
            unitName: 'Unit 3: Differential & Integral Calculus',
            chapters: [
              'Limits, Continuity and Differentiability (Indeterminate Forms, L\'Hôpital\'s Rule, Continuity in Intervals & Differentiability Criteria)',
              'Differentiation (Chain Rule, Implicit, Parametric, Logarithmic & Higher Order Derivatives)',
              'Applications of Derivatives (Rate of Change, Tangents and Normals, Monotonicity, Maxima and Minima & Rolle\'s/Lagrange\'s Mean Value Theorems)',
              'Indefinite Integration (Standard Integrals, Substitution, Integration by Parts, Partial Fractions & Reduction Formulae)',
              'Definite Integration (Fundamental Theorem of Calculus, Properties of Definite Integrals, Leibniz Rule & Periodic Functions)',
              'Area Under Curves (Area bounded by curves, lines, parabolas, circles and piecewise functions)',
              'Differential Equations (Order and Degree, Variable Separable, Homogeneous, Linear First Order & Exact Equations)'
            ]
          },
          {
            unitName: 'Unit 4: Vectors, 3D Geometry & Probability',
            chapters: [
              'Vector Algebra (Dot Product, Cross Product, Scalar Triple Product & Vector Triple Product)',
              'Three Dimensional Geometry (Direction Cosines/Ratios, Equation of Line in 3D, Shortest Distance between Skew Lines & Planes)',
              'Probability and Statistics (Conditional Probability, Total Probability Theorem, Bayes\' Theorem, Random Variables & Binomial Distribution)',
              'Measures of Dispersion (Mean, Median, Mode, Variance, Standard Deviation & Coefficient of Variation)'
            ]
          }
        ],
        chapters: [
          'Functions (Invertible Functions, Even/Odd Functions, Periodic Functions & Functional Equations)',
          'Complex Numbers (Geometry of Complex Numbers, Rotations, Triangular Inequality & nth Roots of Unity)',
          'Quadratic Equations (Location of Roots, Common Roots & Symmetric Functions of Roots)',
          'Matrices and Determinants (Orthogonal/Symmetric Matrices, Cayley-Hamilton Theorem & Matrix Inversion)',
          'Permutations and Combinations (Distribution into Groups, Derangements & Grid Paths)',
          'Binomial Theorem (Binomial Series Approximations & Series involving Binomial Coefficients)',
          'Sequences and Series (Telescoping Sums, AGP & Inequalities AM-GM-HM-Cauchy Schwarz)',
          'Straight Lines (Distance between Parallel Lines, Family of Lines passing through intersection & Homogenization)',
          'Circles (Director Circle, Chord of Contact, Common Tangents to Two Circles & Pole/Polar)',
          'Parabola (Focal Properties, Condition of Tangency y=mx+a/m & Normal in Slope Form)',
          'Ellipse and Hyperbola (Auxiliary Circles, Conjugate Diameters & Rectangular Hyperbola xy=c²)',
          'Limits and Continuity (Standard Limits lim(x->0) sinx/x, (1+x)^(1/x) & Sandwich Theorem)',
          'Differentiability (Corner Points, Cusp & Differentiability of Piecewise and Composite Functions)',
          'Application of Derivatives (Tangent/Normal, Monotonicity Intervals, Global Maxima/Minima & Concavity/Inflection)',
          'Indefinite Integrals (Algebraic and Trigonometric Integrals with Standard Substitutions)',
          'Definite Integrals (King\'s Property ∫f(x)dx = ∫f(a+b-x)dx, Newton-Leibniz Differentiation under Integral Sign)',
          'Area Bounded by Curves (Double Integral Concepts & Bounded Region Integrals)',
          'Differential Equations (Linear Differential Equations dy/dx + Py = Q & Integrating Factor IF=e^(∫Pdx))',
          'Vector Algebra (Linear Independence of Vectors, Reciprocal System of Vectors & Box Product [a b c])',
          'Three Dimensional Geometry (Vector & Cartesian Forms of Lines, Shortest Distance Between Two Lines)',
          'Probability (Bayes\' Theorem, Independent Events & Binomial Distribution Mean np, Variance npq)'
        ]
      }
    ]
  },
  CUET: {
    id: 'CUET',
    title: 'CUET (UG) Central Universities',
    subtitle: 'NTA Common University Entrance Test (Language, Domain & General Test)',
    badge: 'CUET (UG)',
    defaultLevel: 'CUET (UG) NTA',
    subjects: [
      {
        id: 'cuet_general_test',
        name: 'General Test (Section III)',
        description: 'Quantitative Reasoning, Numerical Ability, Logical & Analytical Reasoning, General Knowledge & Current Affairs',
        iconName: 'Compass',
        units: [
          {
            unitName: 'Unit 1: Quantitative Aptitude & Numerical Ability',
            chapters: [
              'Arithmetic: Percentages, Profit & Loss, Simple and Compound Interest',
              'Ratios, Proportions, Mixtures and Alligations',
              'Time and Work, Pipes and Cisterns, Time Speed and Distance',
              'Basic Algebra, Linear Equations, Quadratic Formulations & Polynomials',
              'Geometry & Mensuration (2D & 3D Shapes, Areas, Volumes & Perimeter)'
            ]
          },
          {
            unitName: 'Unit 2: Logical & Analytical Reasoning',
            chapters: [
              'Number Series, Alphabet Series, Coding and Decoding',
              'Blood Relations, Direction Sense Test & Seating Arrangements',
              'Syllogisms, Venn Diagrams & Statement-Conclusion Deductions',
              'Data Interpretation (Bar Charts, Pie Charts, Tables & Line Graphs)',
              'Analogy, Classification & Non-Verbal Pattern Recognition'
            ]
          },
          {
            unitName: 'Unit 3: General Knowledge & Current Affairs',
            chapters: [
              'Indian Polity, Constitution, Fundamental Rights & Governance',
              'Indian Economy, Budget, Inflation, Banking & Financial Terms',
              'General Science: Daily Life Physics, Chemistry & Biology Basics',
              'Important National & International Current Affairs, Awards & Sports'
            ]
          }
        ],
        chapters: [
          'Percentages, Profit and Loss & Discount Calculations',
          'Simple Interest, Compound Interest & Annuity Applications',
          'Ratio, Proportion, Partnership & Unitary Method',
          'Time and Work, Efficiency & Pipes and Cisterns',
          'Time, Speed, Distance, Trains & Relative Speed',
          'Averages, Weighted Mean & Age Problems',
          'Coding-Decoding, Letter & Number Series Sequences',
          'Blood Relations & Family Tree Tree Deductions',
          'Direction Sense Test & Compass Orientations',
          'Linear and Circular Seating Arrangements',
          'Syllogisms, Venn Diagrams & Logical Connectives',
          'Data Interpretation: Bar Graphs, Pie Charts & Line Charts',
          'Indian Polity, Constitution & Fundamental Rights',
          'Indian Economy, NITI Aayog, Budget & Monetary Policy',
          'Current National & Global Affairs, Summits & Sports'
        ]
      },
      {
        id: 'cuet_english_language',
        name: 'English Language (Section IA)',
        description: 'Reading Comprehension, Vocabulary, Verbal Ability, Sentence Rearrangement, Synonyms & Antonyms',
        iconName: 'BookOpen',
        units: [
          {
            unitName: 'Unit 1: Reading Comprehension',
            chapters: [
              'Factual Passages: Direct Data, Fact-Checking & Text Retrieval',
              'Narrative Passages: Theme Identification, Character Inferences & Sequence',
              'Literary Passages: Tone, Mood, Central Idea, Figurative Language & Metaphors'
            ]
          },
          {
            unitName: 'Unit 2: Verbal Ability & Grammar Mechanics',
            chapters: [
              'Rearranging the Parts (Para Jumbles & Sentence Sequencing)',
              'Choosing the Correct Word (Contextual Vocabulary & Cloze Test)',
              'Error Spotting (Subject-Verb Agreement, Tenses, Prepositions & Modifiers)',
              'Active & Passive Voice, Direct & Indirect Speech Rules'
            ]
          },
          {
            unitName: 'Unit 3: Vocabulary & Lexical Skills',
            chapters: [
              'Synonyms and Antonyms in Contextual Usage',
              'Idioms, Phrases, Phrasal Verbs & Collocations',
              'One Word Substitution, Root Words, Prefixes and Suffixes',
              'Foreign Words and Commonly Confused Words / Homophones'
            ]
          }
        ],
        chapters: [
          'Reading Comprehension: Factual Passages & Data Inferences',
          'Reading Comprehension: Narrative Passages & Main Theme Identification',
          'Reading Comprehension: Literary Passages & Tone Analysis',
          'Para Jumbles & Sentence Ordering Techniques',
          'Contextual Cloze Tests & Word Selection',
          'Subject-Verb Agreement & Syntactic Rules',
          'Tenses, Conditionals & Modifiers Error Spotting',
          'Active to Passive Voice Transformation',
          'Direct to Indirect Reported Speech Transformation',
          'Synonyms, Antonyms & Precise Word Meanings',
          'Idiomatic Expressions, Proverbs & Phrasal Verbs',
          'One Word Substitutions & Etymology Root Words',
          'Homophones, Homonyms & Commonly Misspelled Words'
        ]
      },
      {
        id: 'cuet_economics',
        name: 'Economics & Business Economics',
        description: 'Microeconomics, Macroeconomics, National Income, Money & Banking, Indian Economic Development',
        iconName: 'TrendingUp',
        units: [
          {
            unitName: 'Unit 1: Introductory Microeconomics',
            chapters: [
              'Consumer Behaviour and Demand (Utility Analysis, Indifference Curves & Elasticity)',
              'Producer Behaviour and Supply (Production Function, Costs, Revenue & Elasticity of Supply)',
              'Forms of Market and Price Determination (Perfect Competition, Monopoly, Monopolistic)'
            ]
          },
          {
            unitName: 'Unit 2: Introductory Macroeconomics',
            chapters: [
              'National Income and Related Aggregates (GDP, GNP, NNP, Real vs Nominal & Green GDP)',
              'Determination of Income and Employment (Aggregate Demand/Supply, Multiplier & Inflationary Gap)',
              'Money and Banking (Money Creation by Commercial Banks & RBI Monetary Policy Tools)',
              'Government Budget and the Economy (Fiscal Deficit, Revenue Deficit & Budget Objectives)',
              'Balance of Payments and Foreign Exchange Rate (Current/Capital Account & Forex Regimes)'
            ]
          },
          {
            unitName: 'Unit 3: Indian Economic Development',
            chapters: [
              'Development Experience (1947-90) and Economic Reforms since 1991 (LPG Policies)',
              'Current Challenges facing Indian Economy (Human Capital, Rural Development, Employment & Sustainable Growth)',
              'Development Experiences of India: A Comparison with Neighbours (China & Pakistan)'
            ]
          }
        ],
        chapters: [
          'Consumer Equilibrium: Cardinal Utility & Ordinal Indifference Curve Analysis',
          'Price Elasticity of Demand: Percentage, Total Outlay & Geometric Methods',
          'Production Function, Law of Variable Proportions & Cost Curves',
          'National Income Aggregates & Measurement Methods (Value Added, Income, Expenditure)',
          'Keynesian Theory: Aggregate Demand, MPC, MPS & Investment Multiplier',
          'Money Supply (M1, M2, M3, M4) & Credit Creation by Commercial Banks',
          'Central Bank Functions: Repo Rate, Reverse Repo, CRR, SLR & Open Market Operations',
          'Government Budget: Revenue vs Capital Receipts & Deficit Measurements',
          'Balance of Payments Structure & Foreign Exchange Determination',
          'LPG Reforms (1991): Liberalisation, Privatisation and Globalisation Impact',
          'Human Capital Formation & Education / Health Ecosystem in India',
          'Rural Development: Credit Institutions, Microfinance & Organic Farming',
          'Comparative Development: India, China & Pakistan Indicators'
        ]
      },
      {
        id: 'cuet_business_studies',
        name: 'Business Studies',
        description: 'Principles of Management, Business Finance, Marketing Management, Consumer Protection',
        iconName: 'Building2',
        units: [
          {
            unitName: 'Unit 1: Principles and Functions of Management',
            chapters: [
              'Nature and Significance of Management (Features, Objectives & Levels)',
              'Principles of Management (Fayol\'s 14 Principles & Taylor\'s Scientific Management)',
              'Business Environment (Dimensions: Economic, Social, Technological, Political & Legal)',
              'Planning (Process, Types of Plans: Policies, Procedures & Budgets)',
              'Organising (Structure, Delegation of Authority & Decentralisation)',
              'Staffing (Recruitment, Selection, Training & Development)',
              'Directing (Supervision, Motivation: Maslow, Leadership Styles & Communication Barriers)',
              'Controlling (Controlling Process, Relationship between Planning and Controlling)'
            ]
          },
          {
            unitName: 'Unit 2: Business Finance and Marketing',
            chapters: [
              'Financial Management (Financing, Investing and Dividend Decisions, Working Capital)',
              'Financial Markets (Money Market Instruments, Capital Market, NSE, BSE & SEBI Functions)',
              'Marketing Management (Marketing Philosophies, 4 Ps of Marketing Mix: Product, Price, Place, Promotion)',
              'Consumer Protection (Consumer Protection Act 2019, Rights, Redressal Agencies & Remedies)'
            ]
          }
        ],
        chapters: [
          'Nature and Significance of Management & Efficiency vs Effectiveness',
          'Fayol\'s Administrative Principles vs Taylor\'s Scientific Techniques',
          'Business Environment Dimensions & Impact of Policy Changes',
          'Planning Process, Importance & Limitations of Planning',
          'Organisational Structures: Functional vs Divisional Structure',
          'Delegation: Authority, Responsibility, Accountability & Decentralisation',
          'Staffing Process, Sources of Recruitment & Selection Tests',
          'Motivation Theories (Maslow\'s Hierarchy, Financial vs Non-Financial Incentives)',
          'Leadership Styles (Autocratic, Democratic, Laissez-Faire) & Communication Barriers',
          'Controlling Process, Management by Exception (MBE) & Critical Point Control',
          'Financial Decisions: Investment (Capital Budgeting), Financing & Dividend Decisions',
          'Working Capital Factors & Operating Cycle Analysis',
          'Money Market (Treasury Bills, Commercial Paper, Call Money) vs Capital Market',
          'SEBI Objectives, Regulatory, Development & Protective Functions',
          'Marketing Mix: Product Life Cycle, Branding, Packaging & Channels of Distribution',
          'Consumer Rights under CPA 2019 & Three-Tier Redressal Mechanism'
        ]
      },
      {
        id: 'cuet_accountancy',
        name: 'Accountancy / Book Keeping',
        description: 'Partnership Accounts, Company Accounts (Shares & Debentures), Financial Analysis, Computerized Accounting',
        iconName: 'Calculator',
        units: [
          {
            unitName: 'Unit 1: Accounting for Not-for-Profit & Partnerships',
            chapters: [
              'Accounting for Not-for-Profit Organisations (Receipts & Payments, Income & Expenditure)',
              'Accounting for Partnership: Fundamentals (Capital Accounts, P&L Appropriation, Interest on Capital/Drawings)',
              'Reconstitution of Partnership: Change in PSR, Admission, Retirement and Death of Partner',
              'Dissolution of Partnership Firm (Realisation Account & Settlement of Accounts)'
            ]
          },
          {
            unitName: 'Unit 2: Accounting for Companies',
            chapters: [
              'Accounting for Share Capital (Issue of Shares at Par/Premium, Pro-rata Allotment, Forfeiture & Re-issue)',
              'Issue and Redemption of Debentures (Issue as Collateral Security, Writing off Loss on Issue)'
            ]
          },
          {
            unitName: 'Unit 3: Financial Statement Analysis & Cash Flow',
            chapters: [
              'Analysis of Financial Statements (Comparative Statements, Common Size Statements)',
              'Accounting Ratios (Liquidity, Solvency, Activity / Turnover & Profitability Ratios)',
              'Cash Flow Statement (As per AS-3 Revised: Operating, Investing & Financing Activities)'
            ]
          }
        ],
        chapters: [
          'Not-for-Profit Organisations: Receipts & Payments vs Income & Expenditure Account',
          'Partnership Fundamentals: Profit & Loss Appropriation Account & Past Adjustments',
          'Goodwill Valuation: Average Profit, Super Profit & Capitalisation Methods',
          'Admission of a Partner: Sacrificing Ratio, Revaluation Account & Capital Adjustments',
          'Retirement and Death of Partner: Gaining Ratio & Deceased Partner\'s Share of Profit',
          'Dissolution of Partnership Firm: Realisation Account & Treatment of Partner Loans',
          'Company Accounts: Pro-rata Allotment of Shares & Accounting for Calls-in-Arrears/Advance',
          'Forfeiture of Shares & Reissue at Discount / Transfer to Capital Reserve',
          'Debentures: Issue with terms of Redemption & Writing off Loss on Issue',
          'Financial Statement Analysis: Comparative & Common Size Balance Sheets',
          'Accounting Ratios: Current, Quick, Debt-Equity, Inventory Turnover & ROI Ratios',
          'Cash Flow Statement: Cash from Operating Activities (Indirect Method AS-3)',
          'Cash Flow from Investing and Financing Activities & Cash Equivalents'
        ]
      },
      {
        id: 'cuet_mathematics',
        name: 'Mathematics & Applied Mathematics',
        description: 'Section A (Common), Section B1 (Pure Mathematics), Section B2 (Applied Mathematics)',
        iconName: 'Percent',
        units: [
          {
            unitName: 'Section A: Common Compulsory Module',
            chapters: [
              'Algebra of Matrices and Determinants (Adjoint, Inverse & System of Equations)',
              'Calculus: Higher Order Derivatives, Maxima and Minima, Definite Integrals',
              'Differential Equations and Modeling',
              'Probability Distributions (Random Variables, Expected Value & Binomial Distribution)',
              'Linear Programming Problems (Graphical Method & Corner Points)'
            ]
          },
          {
            unitName: 'Section B1: Pure Mathematics Stream',
            chapters: [
              'Relations and Functions & Inverse Trigonometric Functions',
              'Continuity, Differentiability & Applications of Integrals (Areas)',
              'Vectors and Three Dimensional Geometry (Lines and Planes)',
              'Probability (Bayes\' Theorem & Conditional Probability)'
            ]
          },
          {
            unitName: 'Section B2: Applied Mathematics Stream',
            chapters: [
              'Numbers, Quantification and Numerical Applications (Modulo Arithmetic, Boats & Streams)',
              'Financial Mathematics (Perpetuity, Sinking Funds, EMI, Effective Rate of Interest & CAGR)',
              'Linear Programming Problems in Economics and Business',
              'Time Series and Index Numbers (Moving Averages & Trend Analysis)'
            ]
          }
        ],
        chapters: [
          'Matrices: Multiplication, Transpose, Symmetric/Skew-Symmetric & Inverse AX=B',
          'Determinants: Evaluation, Properties, Minors, Cofactors & Cramer\'s Rule',
          'Continuity, Differentiability & Derivatives of Implicit/Parametric Functions',
          'Applications of Derivatives: Rate of Change, Increasing/Decreasing & Maxima/Minima',
          'Definite and Indefinite Integrals & Fundamental Theorem of Calculus',
          'Area Under Simple Curves (Parabolas, Circles, Ellipses & Lines)',
          'Differential Equations: Order, Degree & Solution of Homogeneous/Linear Equations',
          'Vectors: Dot Product, Cross Product & Projection of a Vector',
          'Three Dimensional Geometry: Direction Cosines/Ratios & Shortest Distance between Skew Lines',
          'Probability: Bayes\' Theorem, Multiplication Theorem & Binomial Distribution',
          'Linear Programming: Feasible Region, Objective Function & Corner Point Solutions',
          'Applied Math: Modulo Arithmetic, Congruences & Clock Arithmetic',
          'Financial Math: Sinking Funds, Loan Amortization Schedule & EMI Calculation',
          'Time Series Analysis: Method of Moving Averages & Least Squares Trend Line'
        ]
      }
    ]
  },
  CA_FINAL: {
    id: 'CA_FINAL',
    title: 'CA Final (ICAI New Scheme 2024+)',
    subtitle: 'Institute of Chartered Accountants of India - Group 1 & Group 2',
    badge: 'CA Final ICAI',
    defaultLevel: 'CA Final (ICAI New Scheme)',
    subjects: [
      {
        id: 'cafinal_financial_reporting',
        name: 'Financial Reporting (Paper 1)',
        description: 'Ind AS 115 (Revenue), Ind AS 116 (Leases), Ind AS 109 (Financial Instruments), Ind AS 103 (Business Combinations), Ind AS 110 (Consolidation) & Integrated Reporting',
        iconName: 'BookOpen',
        units: [
          {
            unitName: 'Unit 1: Framework & Core Ind AS Standards',
            chapters: [
              'Conceptual Framework for Financial Reporting under Ind AS',
              'Ind AS 115: Revenue from Contracts with Customers (5-Step Model, Variable Consideration & Contract Assets)',
              'Ind AS 116: Leases (ROU Asset, Lease Liability, Modification & Sale-and-Leaseback)',
              'Ind AS 12: Income Taxes (Temporary Differences, DTA/DTL on Fair Value & Unused Tax Losses)',
              'Ind AS 19: Employee Benefits (Defined Contribution vs Defined Benefit, Actuarial Gains/Losses in OCI)',
              'Ind AS 36: Impairment of Assets (Cash-Generating Units, Value in Use & Recoverable Amount)'
            ]
          },
          {
            unitName: 'Unit 2: Financial Instruments & Fair Value (Ind AS 109 / 32 / 107 / 113)',
            chapters: [
              'Classification and Measurement of Financial Assets & Liabilities (Amortised Cost, FVTOCI, FVTPL)',
              'Impairment of Financial Assets: Expected Credit Loss (ECL Model)',
              'Derivatives and Embedded Derivatives Accounting',
              'Hedge Accounting: Fair Value Hedge, Cash Flow Hedge & Net Investment Hedge',
              'Ind AS 32: Financial Instruments Presentation (Compound Instruments & Split Accounting)',
              'Ind AS 113: Fair Value Measurement (Fair Value Hierarchy: Level 1, 2, 3 Inputs)'
            ]
          },
          {
            unitName: 'Unit 3: Group Accounts, Business Combinations & Special Reporting',
            chapters: [
              'Ind AS 103: Business Combinations (Acquisition Method, Purchase Consideration, NCI & Goodwill/Gain on Bargain Purchase)',
              'Ind AS 110: Consolidated Financial Statements (Control Assessment, Elimination of Intra-Group & Step Acquisition)',
              'Ind AS 111 & Ind AS 28: Joint Arrangements and Investments in Associates (Equity Method)',
              'Ind AS 21: The Effects of Changes in Foreign Exchange Rates & Foreign Operations Translation',
              'Corporate Social Responsibility (CSR) Accounting & Integrated Reporting / ESG Disclosures'
            ]
          }
        ],
        chapters: [
          'Ind AS 115: Revenue from Contracts with Customers (5-Step Framework)',
          'Ind AS 116: Leases (Lessee & Lessor Accounting, ROU Asset & Lease Liability)',
          'Ind AS 109: Financial Instruments (Classification, Measurement & Amortised Cost)',
          'Ind AS 109: Expected Credit Loss (ECL) Model & Hedge Accounting',
          'Ind AS 32: Financial Instruments Presentation (Compound Instruments & Equity Split)',
          'Ind AS 103: Business Combinations (Acquisition Date Fair Value & Goodwill/Gain on Bargain Purchase)',
          'Ind AS 110: Consolidated Financial Statements (Control, NCI & Unrealised Profits)',
          'Ind AS 12: Income Taxes (Deferred Tax Asset / Liability & Tax Base Calculations)',
          'Ind AS 19: Employee Benefits (Defined Benefit Obligation & Actuarial Assumptions)',
          'Ind AS 36: Impairment of Assets & Cash Generating Units (CGU)',
          'Ind AS 21: Foreign Exchange Rates & Foreign Subsidiary Consolidation',
          'Ind AS 33: Earnings Per Share (Basic & Diluted EPS)',
          'Integrated Reporting & Business Responsibility and Sustainability Reporting (BRSR)'
        ]
      },
      {
        id: 'cafinal_advanced_financial_management',
        name: 'Advanced Financial Management (Paper 2)',
        description: 'Forex Risk Management, Derivatives (Futures, Options & Swaps), Interest Rate Risk Management, Portfolio Management & Business Valuation',
        iconName: 'TrendingUp',
        units: [
          {
            unitName: 'Unit 1: Foreign Exchange Exposure and International Finance',
            chapters: [
              'Foreign Exchange Risk Management (Nostro/Vostro, Bid-Ask Spread, Cross Currency Rates & Triangular Arbitrage)',
              'Exchange Rate Determination: Purchasing Power Parity (PPP), Interest Rate Parity (IRP) & International Fisher Effect',
              'Hedging Techniques: Forward Contracts, Money Market Hedge, Currency Futures and Options',
              'International Financial Management (GDRs, ADRs, Foreign Direct Investment & International Capital Budgeting)'
            ]
          },
          {
            unitName: 'Unit 2: Derivatives & Interest Rate Risk Management',
            chapters: [
              'Financial Derivatives: Futures & Options Pricing (Black-Scholes Model, Greeks: Delta, Gamma, Vega, Theta)',
              'Commodity & Financial Swaps (Interest Rate Swaps, Currency Swaps & Comparative Advantage Theory)',
              'Interest Rate Risk Management: Forward Rate Agreements (FRAs), Interest Rate Guarantees (Caps, Floors & Collars)'
            ]
          },
          {
            unitName: 'Unit 3: Portfolio Management, Security Valuation & Corporate Restructuring',
            chapters: [
              'Security Valuation (Equity Valuation Models, DDM, P/E Multiple, Bond Duration & Convexity)',
              'Portfolio Management (Markowitz Efficient Frontier, CAPM, Beta Calculation, Sharpe, Treynor & Jensen Alpha)',
              'Mutual Funds: NAV Computation, Performance Evaluation & Fama Decomposition',
              'Mergers, Acquisitions and Corporate Restructuring (Exchange Ratio, Synergy Valuation, EVA & MVA)',
              'Startup Finance: Pitch Deck, Bootstrapping, Angel Investors & Venture Capital Methods'
            ]
          }
        ],
        chapters: [
          'Forex Management: Cross Rates, Triangular Arbitrage & Forward Margins',
          'Forex Hedging: Forward Cover, Money Market Hedge vs Currency Option Hedge',
          'Exchange Rate Theories: Interest Rate Parity (IRP) & Purchasing Power Parity (PPP)',
          'Derivatives: Option Pricing using Binomial Model & Black-Scholes Model',
          'Interest Rate Risk: Interest Rate Swaps & Cost Savings Apportionment',
          'Interest Rate Hedging: Forward Rate Agreements (FRAs), Caps, Floors & Collars',
          'Portfolio Theory: Risk-Return of 2-Asset & Multi-Asset Portfolios',
          'Capital Asset Pricing Model (CAPM), Security Market Line (SML) & Beta Estimation',
          'Portfolio Performance Evaluation: Sharpe Ratio, Treynor Ratio & Jensen Alpha',
          'Bond Valuation: Duration, Modified Duration, Macaulay Duration & Convexity',
          'Mergers & Acquisitions: Swap Ratio based on EPS, Market Price & Book Value',
          'Economic Value Added (EVA) & Market Value Added (MVA) Valuation',
          'Startup Valuation: Venture Capital Method & Berkus Method'
        ]
      },
      {
        id: 'cafinal_advanced_auditing_ethics',
        name: 'Advanced Auditing and Ethics (Paper 3)',
        description: 'Standards on Auditing (SA 200-720 series), Quality Management (SQC 1), Group Audits (SA 600), Bank/NBFC Audit & CA Act 1949 Professional Ethics',
        iconName: 'ShieldCheck',
        units: [
          {
            unitName: 'Unit 1: Standards on Auditing & Quality Management',
            chapters: [
              'SQC 1 & Quality Management in Audit Firms',
              'SA 200, 210, 220, 230: Audit Planning, Engagement Terms & Documentation',
              'SA 315 & SA 330: Identifying and Assessing Risks of Material Misstatement through understanding entity and Internal Control',
              'SA 240: The Auditor\'s Responsibilities Relating to Fraud in an Audit',
              'SA 500, 501, 505, 520, 530: Audit Evidence, External Confirmations & Analytical Procedures',
              'SA 540 (Auditing Accounting Estimates), SA 550 (Related Parties), SA 560 (Subsequent Events), SA 570 (Going Concern)',
              'SA 700, 701, 705, 706: Audit Reports, Key Audit Matters (KAM) & Modified Opinions'
            ]
          },
          {
            unitName: 'Unit 2: Specialized Audits & Digital Audit',
            chapters: [
              'SA 600: Using the Work of Another Auditor & Group Audits',
              'Audit of Banks and Non-Banking Financial Companies (NBFCs - Prudential Norms, NPA Classification)',
              'Audit of Public Sector Undertakings (PSUs - Propriety Audit & CAG Duties)',
              'Digital Auditing, Continuous Auditing, Data Analytics & Automated Environment Controls',
              'Internal Audit, Management Audit, Due Diligence & Forensic Accounting Investigation'
            ]
          },
          {
            unitName: 'Unit 3: Professional Ethics & The Chartered Accountants Act 1949',
            chapters: [
              'First Schedule to CA Act 1949: Professional Misconduct for Members in Practice (Part I Clauses 1 to 12)',
              'First Schedule: Members in Service (Part II) & Other Misconduct (Part III & IV)',
              'Second Schedule: Professional Misconduct for Practice (Part I Clauses 1 to 10), In Service (Part II) & General (Part III)',
              'ICAI Council Guidelines, Independence of Auditors, Self-Interest/Self-Review Threats & Safeguards'
            ]
          }
        ],
        chapters: [
          'Standards on Auditing: SA 200 to SA 299 Core Principles & Responsibilities',
          'SA 315 & SA 330: Risk Assessment and Internal Controls Testing',
          'SA 240: Auditor\'s Responsibilities Relating to Fraud & Fraud Indicators',
          'SA 500 series: Audit Evidence, External Confirmations (SA 505) & Sampling (SA 530)',
          'SA 570: Going Concern Assessment, Management Plans & Reporting Implications',
          'SA 700 series: Forming an Opinion, Key Audit Matters (SA 701) & Qualified/Disclaimer Reports',
          'SA 600: Group Audits & Using the Work of Principal vs Component Auditors',
          'Bank Audit: NPA Classification, Income Recognition & Provisioning Norms (IRAC)',
          'NBFC Audit: Scale Based Regulation (Base, Middle, Upper & Top Layer)',
          'Forensic Accounting & Fraud Investigation Methodologies',
          'Professional Ethics: First Schedule Part I Clauses 1 to 12 in-depth Analysis',
          'Professional Ethics: Second Schedule Part I Clauses 1 to 10 in-depth Analysis',
          'Council Guidelines: Limits on Number of Audits, Indebtedness & Fees contingent on results'
        ]
      },
      {
        id: 'cafinal_direct_tax_international',
        name: 'Direct Tax Laws & International Taxation (Paper 4)',
        description: 'Corporate Taxation, Trust Taxation, Transfer Pricing (Sec 92 to 92F), Equalisation Levy, DTAA (Sec 90/91), GAAR & BEPS Framework',
        iconName: 'Building2',
        units: [
          {
            unitName: 'Unit 1: Corporate Taxation & Special Entities',
            chapters: [
              'Taxation of Companies (Domestic vs Foreign, Concessional Regime Sec 115BAA / 115BAB)',
              'Minimum Alternate Tax (MAT u/s 115JB - Book Profit Adjustments)',
              'Taxation of Charitable and Religious Trusts (Registration Sec 12AB, Accumulation u/s 11(2), Accreted Tax Sec 115TD)',
              'Taxation of Business Trusts (REITs & InvITs Sec 115UA) and Alternative Investment Funds (Sec 115UB)'
            ]
          },
          {
            unitName: 'Unit 2: International Taxation & Transfer Pricing',
            chapters: [
              'Transfer Pricing: Associated Enterprises (Sec 92A), Computation of Arm\'s Length Price (CUP, RPM, CPM, TNMM, PSM)',
              'Safe Harbour Rules, Advance Pricing Agreements (APA u/s 92CC) & Secondary Adjustments (Sec 92CE)',
              'Non-Resident Taxation (Sec 9 Scope, Presumptive Taxation Sec 44B/44BB/44BBA)',
              'Equalisation Levy (6% on Online Advertising & 2% on E-commerce Operators)',
              'Double Taxation Avoidance Agreements (DTAA u/s 90/90A & Unilateral Relief u/s 91)',
              'Base Erosion and Profit Shifting (BEPS) Action Plans, MLI & General Anti-Avoidance Rules (GAAR Chapter X-A)'
            ]
          },
          {
            unitName: 'Unit 3: Assessment Procedures, Appeals & Penalties',
            chapters: [
              'Assessment Procedures (Faceless Assessment Sec 144B, Reassessment Sec 147-151)',
              'Search, Seizure and Block Assessment Procedures (Sec 132 & 132A)',
              'Appeals and Revision (CIT(A), ITAT, High Court, Supreme Court & Revision by PCIT u/s 263/264)',
              'Penalties for Under-reporting & Misreporting of Income (Sec 270A) & Prosecution Provisions'
            ]
          }
        ],
        chapters: [
          'Corporate Taxation: Section 115BAA / 115BAB Concessional Tax Regimes',
          'Minimum Alternate Tax (MAT u/s 115JB) Computation & MAT Credit (Sec 115JAA)',
          'Charitable Trusts: Section 11, 12, 12AB Exemption & Accreted Tax (Sec 115TD)',
          'Business Trusts: Taxability in hands of Trust vs Unit Holders (Sec 115UA)',
          'Transfer Pricing: Arm\'s Length Price (ALP) Methods & Most Appropriate Method (MAM)',
          'Secondary Adjustments (Sec 92CE) & Thin Capitalisation (Sec 94B)',
          'Non-Resident Taxation & Withholding Tax Obligations (Sec 195)',
          'Double Taxation Relief: Bilateral (Sec 90) & Unilateral Relief (Sec 91 Calculation)',
          'Equalisation Levy & Significant Economic Presence (SEP)',
          'General Anti-Avoidance Rule (GAAR - Impermissible Avoidance Arrangement)',
          'Income Escaping Assessment: Reassessment Procedure under Section 148/148A',
          'Revision by Principal Commissioner u/s 263 (Prejudicial to Revenue) and Sec 264',
          'Penalties: Under-reporting & Misreporting of Income (Section 270A)'
        ]
      },
      {
        id: 'cafinal_indirect_tax_laws',
        name: 'Indirect Tax Laws - GST & Customs (Paper 5)',
        description: 'GST (Inverted Duty Structure, ITC Refunds Rule 89, Demand & Recovery Sec 73/74, Appeals, E-way bill), Customs Act 1962 & Foreign Trade Policy 2023',
        iconName: 'Calculator',
        units: [
          {
            unitName: 'Unit 1: Advanced Goods and Services Tax (GST)',
            chapters: [
              'Supply, Place of Supply & Inter-state / Intra-state Cross Border Transactions',
              'Valuation under GST: Transaction Value, Related Person & Distinct Person Rules (Rules 27 to 31)',
              'Input Tax Credit (ITC - Rule 42/43 Apportionment for Capital Goods, Inverted Duty Refund Sec 54(3) & Rule 89(5))',
              'Refunds under GST (Zero-Rated Exports under LUT vs with Payment of IGST Rule 89(4))',
              'Assessment, Audit by Tax Authorities (Sec 65/66) & Inspection, Search, Seizure (Sec 67)',
              'Demands and Recovery (Section 73 & Section 74, SCN Timelines & Penalty Matrix)',
              'Appeals and Revision under GST (Appellate Authority, GSTAT & Pre-deposit Requirements)'
            ]
          },
          {
            unitName: 'Unit 2: Customs Laws & Foreign Trade Policy',
            chapters: [
              'Levy of Customs Duty, Types of Duties (BCD, SWS, Safeguard, Anti-Dumping & Countervailing Duty)',
              'Customs Valuation Rules (Import Valuation Rules 2007: Transaction Value, Rule 10 Inclusions & Export Valuation)',
              'Classification of Goods (General Rules of Interpretation & HSN Coding)',
              'Import and Export Procedures (Bill of Entry, Assessment Sec 17, Warehousing Sec 57-73)',
              'Duty Drawback (Section 74 on Re-export & Section 75 on Manufactured Exports)',
              'Foreign Trade Policy 2023: EPCG Scheme, Advance Authorisation & RoDTEP Scheme'
            ]
          }
        ],
        chapters: [
          'GST Place of Supply: Section 10 to 13 of IGST Act in Complex Cross-Border Services',
          'GST Valuation: Valuation Rules 27-31 for Related Parties, Pure Agent & Foreign Currency',
          'Input Tax Credit: Reversal for Exempt Supplies (Rule 42) & Capital Goods (Rule 43)',
          'Refunds: Inverted Duty Structure (Rule 89(5)) & Zero Rated Export Refund (Rule 89(4))',
          'Demand and Recovery: Section 73 (Non-fraud) vs Section 74 (Fraud/Wilful Misstatement)',
          'Appeals and Revision: Pre-deposit Mandates for First & Second Appellate Forum (GSTAT)',
          'Offences, Penalties & Compounding of Offences under GST (Sec 122 to 138)',
          'Customs Valuation: Import Valuation Rules & Mandatory Inclusions under Rule 10(1)/(2)',
          'Customs Warehousing: In-bond Manufacturing (Section 65 / MOOWR Scheme)',
          'Duty Drawback: Section 74 (Identifiable Goods) vs Section 75 (All Industry Rates)',
          'Foreign Trade Policy 2023: Advance Authorisation & Duty Remission Schemes'
        ]
      }
    ]
  }
};


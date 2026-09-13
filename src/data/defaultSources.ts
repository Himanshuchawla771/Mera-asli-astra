import { ReferenceSource } from '../types';

export const DEFAULT_SOURCES: ReferenceSource[] = [
  // ==========================================
  // OFFICIAL SYLLABUS & RATIONALIZED CURRICULUM (CBSE & ICAI)
  // ==========================================
  {
    id: 'src_c12_cbse_master_syllabus',
    title: 'CBSE Class 12 & 11 Commerce: Official 2025-26 Rationalized Syllabus & Deleted Topics Guard',
    category: 'Official Syllabus',
    journey: 'CLASS_12',
    level: 'Class 12 CBSE',
    subject: 'All Subjects',
    chapter: 'Official Curriculum Blueprint & Deleted Topics Blacklist',
    description: 'Complete official CBSE rationalized syllabus for Accountancy (055), Business Studies (054), Economics (030), and Mathematics (041). Contains explicit lists of deleted/excluded topics.',
    content: `CBSE CLASS 12 & 11 COMMERCE - OFFICIAL 2025-2026 RATIONALIZED SYLLABUS & BLUEPRINT

1. ACCOUNTANCY (SUBJECT CODE 055):
A. PART A: ACCOUNTING FOR PARTNERSHIP FIRMS AND COMPANIES (60 Marks)
   - Unit 1: Accounting for Partnership Firms (36 Marks)
     * Fundamentals of Partnership: Partnership deed, P&L Appropriation, Capital Accounts (Fixed vs Fluctuating), Interest on Capital/Drawings, Past Adjustments, Guarantee of Profits.
     * Goodwill: Nature, Factors, Valuation (Average Profits, Super Profits, Capitalisation).
     * Admission of a Partner: Sacrificing Ratio, Revaluation A/c, Treatment of Goodwill, Accumulated Profits/Losses, Reconstituted Balance Sheet.
     * Retirement & Death of a Partner: Gaining Ratio, Revaluation, Goodwill adjustment, Deceased partner's share of profit up to date of death (P&L Suspense A/c).
     * Dissolution of Partnership Firm: Realisation Account, Partners' Loans, Capital Accounts, Bank/Cash Account.
   - Unit 2: Accounting for Companies (24 Marks)
     * Accounting for Share Capital: Issue, Pro-rata allotment, Calls in Arrears/Advance, Forfeiture of shares, Reissue of forfeited shares, Disclosure in Company Balance Sheet (Schedule III).
     * Accounting for Debentures: Issue at par/premium/discount with redemption conditions, Issue as Collateral Security, Writing off Discount/Loss on Issue of Debentures.
B. PART B: FINANCIAL STATEMENT ANALYSIS (20 Marks)
   - Unit 3: Analysis of Financial Statements (12 Marks)
     * Financial Statements of a Company: Balance Sheet and Statement of P&L format as per Schedule III Part I & II.
     * Accounting Ratios: Liquidity, Solvency, Activity/Turnover, Profitability.
     * Cash Flow Statement (8 Marks): Operating, Investing, Financing Activities as per AS-3 (Revised) Indirect Method.
C. CRITICAL DELETED / EXCLUDED TOPICS (NEVER ASK IN EXAMS/PYQs):
   - ❌ Accounting for Not-for-Profit Organisations (NPO): COMPLETELY REMOVED from Class 12 CBSE!
   - ❌ Redemption of Debentures: Methods like Purchase in open market, Conversion, and Draw of lots are DELETED!
   - ❌ Retirement/Death: Joint Life Policy (JLP) and Individual Life Policy accounting are DELETED!
   - ❌ Partner's Loan Account with multiple installments and interest calculation has been simplified/excluded from standard board evaluation.

2. ECONOMICS (SUBJECT CODE 030):
A. PART A: INTRODUCTORY MACROECONOMICS (40 Marks)
   - Unit 1: National Income and Related Aggregates (10 Marks)
   - Unit 2: Money and Banking (6 Marks)
   - Unit 3: Determination of Income and Employment (12 Marks)
   - Unit 4: Government Budget and the Economy (6 Marks)
   - Unit 5: Balance of Payments & Foreign Exchange (6 Marks)
B. PART B: INDIAN ECONOMIC DEVELOPMENT (40 Marks)
   - Unit 6: Development Experience (1947-90) and Economic Reforms since 1991 (12 Marks)
     * Indian Economy on the Eve of Independence (1947)
     * Indian Economy (1950 - 1990)
     * Economic Reforms Since 1991 (LPG)
   - Unit 7: Current Challenges Facing Indian Economy (20 Marks)
     * Human Capital Formation in India
     * Rural Development: Credit & Marketing
     * Employment: Growth, Informalisation & Other Issues
     * Environment and Sustainable Economic Development
   - Unit 8: Development Experience of India: A Comparison with Neighbours (8 Marks)
     * Comparative Development Experiences (India, China, Pakistan)
C. CRITICAL DELETED / EXCLUDED TOPICS (NEVER ASK IN EXAMS/PYQs):
   - ❌ "Poverty" (Entire Chapter): COMPLETELY REMOVED from IED by CBSE!
   - ❌ "Infrastructure" (Entire Chapter - Energy, Health, Transport): COMPLETELY REMOVED from IED!
   - ❌ Detailed Five-Year Plans chronological targets: Rationalized (only 4 primary goals remain: Growth, Modernisation, Self-reliance, Equity).
   - ❌ In Macroeconomics: In-depth Deficit Financing mechanics; old banking statutes obsolete detail.

3. BUSINESS STUDIES (SUBJECT CODE 054):
A. PART A: PRINCIPLES AND FUNCTIONS OF MANAGEMENT (50 Marks)
   - Nature & Significance of Management, Principles of Management (Fayol & Taylor), Business Environment.
   - Planning, Organising, Staffing, Directing, Controlling (POLCA).
B. PART B: BUSINESS FINANCE AND MARKETING (30 Marks)
   - Financial Management, Financial Markets, Marketing Management, Consumer Protection.
C. CRITICAL DELETED / OBSOLETE TOPICS (NEVER ASK IN EXAMS/PYQs):
   - ❌ Consumer Protection Act 1986: OBSOLETE & REPLACED! Questions MUST strictly adhere to Consumer Protection Act 2019 (Three-tier redressal: District Commission up to ₹50 Lakh, State Commission ₹50 Lakh to ₹2 Crore, National Commission above ₹2 Crore). Old limits (20 lakh / 1 crore) are strictly invalid.
   - ❌ Old stock exchange floor/pit trading open outcry mechanisms: Replaced by screen-based trading, dematerialisation & depositories (NSDL/CDSL).

4. MATHEMATICS (SUBJECT CODE 041):
A. ACTIVE SYLLABUS: Relations & Functions, Inverse Trigonometric Functions, Matrices, Determinants, Continuity & Differentiability, Application of Derivatives (Rate of change, Increasing/Decreasing, Maxima/Minima), Integrals, Application of Integrals, Differential Equations, Vectors, Three Dimensional Geometry (Lines only), Linear Programming, Probability (Conditional & Bayes' Theorem).
B. CRITICAL DELETED TOPICS (NEVER ASK IN EXAMS/PYQs):
   - ❌ Properties of Determinants (Exercise 4.2 in old NCERT): COMPLETELY DELETED!
   - ❌ Tangents and Normals, Approximations (Application of Derivatives): DELETED!
   - ❌ Rolle's and Lagrange's Mean Value Theorems: DELETED!
   - ❌ 3D Geometry: Plane Equations, Angle between two planes, Distance of a point from a plane, Coplanarity: COMPLETELY DELETED (Only Lines in 3D are in syllabus).
   - ❌ Probability: Binomial Probability Distribution, Mean & Variance of random variable: DELETED!`,
    isActive: true,
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'src_ca_icai_master_syllabus',
    title: 'ICAI CA Foundation New Scheme: Official 2024-2025-2026 Complete Syllabus & Blueprint',
    category: 'Official Syllabus',
    journey: 'CA_FOUNDATION',
    level: 'CA Foundation ICAI',
    subject: 'All Subjects',
    chapter: 'ICAI New Scheme 100-Mark 4-Paper Blueprint & Discontinued Topics',
    description: 'Official ICAI New Scheme curriculum covering Paper 1 (Accounting), Paper 2 (Business Laws), Paper 3 (Quantitative Aptitude), Paper 4 (Business Economics). Specifies new additions and discontinued old-scheme topics (BCR and BCK removed).',
    content: `ICAI CA FOUNDATION NEW SCHEME OF EDUCATION & TRAINING - OFFICIAL 2024-2025-2026 SYLLABUS

PAPER 1: ACCOUNTING (100 MARKS - SUBJECTIVE EXAM)
1. Theoretical Framework & Accounting Process (Journal, Ledger, Trial Balance, Rectification of Errors).
2. Bank Reconciliation Statement (BRS).
3. Inventories (AS-2: Cost formulas, Valuation at lower of cost or NRV).
4. Depreciation and Amortization (AS-10: Straight Line, WDV, Change in method).
5. Bills of Exchange & Promissory Notes (Dishonour, Renewal, Retirement under rebate).
6. Final Accounts of Sole Proprietors and Manufacturing Entities.
7. Financial Statements of Not-for-Profit Organisations (NPO - Receipts & Payments, Income & Expenditure, Balance Sheet).
8. Accounts from Incomplete Records (Single Entry System - Conversion method and Statement of Affairs).
9. Partnership Accounts:
   - Fundamentals, Goodwill valuation and accounting, Admission, Retirement, Death.
   - Dissolution of Partnership Firm (NEW IN FOUNDATION!): Realisation A/c, Insolvency of Partners (Garner v. Murray rule), Piecemeal Distribution of Cash (Maximum Loss method & Proportionate Capital method).
10. Company Accounts:
   - Issue, Forfeiture & Reissue of Shares, Forfeiture in case of pro-rata allotment.
   - Issue of Debentures.
   - Redemption of Preference Shares (NEW IN FOUNDATION!).
   - Redemption of Debentures (NEW IN FOUNDATION!).
   - Accounting for Bonus Issue and Right Issue (NEW IN FOUNDATION!).
CRITICAL DELETED / EXCLUDED TOPICS:
- ❌ Consignment Accounts: REMOVED from CA Foundation New Scheme!
- ❌ Sale of Goods on Approval or Return Basis: Removed as standalone high-mark chapter.

PAPER 2: BUSINESS LAWS (100 MARKS - 100% SUBJECTIVE LAW PAPER)
1. Chapter 1: Indian Regulatory Framework (NEW CHAPTER! Hierarchy of courts, Ministry of Corporate Affairs, SEBI, RBI, law-making process).
2. Chapter 2: The Indian Contract Act, 1872:
   - General Principles: Offer & Acceptance, Consideration, Capacity to Contract, Free Consent, Legality of Object, Void Agreements, Performance & Discharge, Remedies for Breach.
   - Special Contracts (NEW IN FOUNDATION! Moved from old Inter): Contract of Indemnity & Guarantee, Bailment & Pledge, Contract of Agency.
3. Chapter 3: The Sale of Goods Act, 1930: Formation, Conditions & Warranties, Transfer of Ownership, Performance, Rights of Unpaid Seller.
4. Chapter 4: The Indian Partnership Act, 1932: Nature, Relations of Partners, Registration and Dissolution of Firm.
5. Chapter 5: The Limited Liability Partnership Act, 2008: Essential features, Incorporation, Differences with partnership and company.
6. Chapter 6: The Companies Act, 2013: Meaning, Features, Corporate Veil, Classes of Companies, MOA & AOA, Doctrine of Ultra Vires & Indoor Management.
7. Chapter 7: The Negotiable Instruments Act, 1881 (NEW IN FOUNDATION!): Characteristics, Promissory Note, Bill of Exchange, Cheque, Crossing, Negotiation, Presentment, Dishonour of Cheques under Section 138.
CRITICAL DELETED / EXCLUDED FROM NEW SCHEME:
- ❌ Business Correspondence & Reporting (BCR - 40 Marks English): COMPLETELY DELETED! Paper 2 is now 100% pure Business Laws.

PAPER 3: QUANTITATIVE APTITUDE (100 MARKS - OBJECTIVE MCQ)
Part A: Business Mathematics (40 Marks) - Ratio, Proportion, Indices, Logarithms; Equations; Linear Inequalities; Mathematics of Finance (TVM: Simple/Compound Interest, Annuity, Sinking Fund); Permutations & Combinations; Sequence & Series; Sets, Relations, Functions, Limits, Differential & Integral Calculus.
Part B: Logical Reasoning (20 Marks) - Number Series, Coding-Decoding; Direction Tests; Seating Arrangements; Blood Relations.
Part C: Statistics (40 Marks) - Statistical Representation of Data; Measures of Central Tendency and Dispersion; Probability; Theoretical Distributions (Binomial, Poisson, Normal); Correlation and Regression; Index Numbers.

PAPER 4: BUSINESS ECONOMICS (100 MARKS - OBJECTIVE MCQ, 100% ECONOMICS)
Part I: Business Economics (Microeconomics - 50 Marks)
- Introduction, Basic problems, Nature & Scope.
- Theory of Demand and Supply, Elasticity, Consumer Behaviour (Indifference Curve).
- Theory of Production and Cost (Short run, Long run, Isoquants, Envelope curve).
- Price Determination in Different Markets (Perfect Competition, Monopoly, Monopolistic, Oligopoly).
- Business Cycles (Phases, Causes, Theories).
Part II: Macroeconomics & Public Finance (NEW IN FOUNDATION! - 50 Marks)
- National Income Accounting (Gross & Net Aggregates, Measurement Methods, Circular Flow of Income).
- Public Finance (Fiscal policy, Public expenditure, Public revenue, Deficit financing, Market failure & Government intervention).
- Monetary Policy and Money Market (Concept of Money Demand, Money Supply measures M1-M4, RBI instruments).
- International Trade (Theories of International Trade, Trade Policies, Tariffs, Exchange rate regimes, Balance of Payments).
CRITICAL DELETED / EXCLUDED FROM NEW SCHEME:
- ❌ Business and Commercial Knowledge (BCK - 40 Marks): COMPLETELY DELETED! BCK no longer exists in CA Foundation.`,
    isActive: true,
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // ==========================================
  // CLASS 12 - ACCOUNTANCY
  // ==========================================
  {
    id: 'src_c12_acc_partnership',
    title: 'NCERT & CBSE Accountancy: Partnership Accounting Standards',
    category: 'NCERT Book',
    journey: 'CLASS_12',
    level: 'Class 12 CBSE',
    subject: 'Accountancy',
    chapter: 'Fundamentals of Partnership',
    description: 'Official CBSE evaluation rules for P&L Appropriation, Capital Accounts (Fixed vs Fluctuating), Interest on Drawings, and Past Adjustments.',
    content: `CBSE CLASS 12 ACCOUNTANCY - PARTNERSHIP EVALUATION CRITERIA:
1. P&L APPROPRIATION ACCOUNT:
   - Debit: Interest on Capital, Partner Salaries/Commissions, Transfer to Reserve.
   - Credit: Net Profit b/d, Interest on Drawings.
   - Interest on drawings calculation: Product method or Average Period method (e.g. 6.5 months for beginning of each month, 6 months for middle, 5.5 months for end).
2. JOURNAL ENTRIES & WORKING NOTES:
   - Proper format (Date, Particulars, L.F., Dr. (₹), Cr. (₹)) is required.
   - Working notes form an integral part of the answer and carry explicit marks.
   - For Past Adjustments: A structured Analytical Table showing net debit/credit impact must be provided.
3. SACRIFICING & GAINING RATIO:
   - Sacrificing Ratio = Old Share - New Share.
   - Goodwill of incoming partner distributed among sacrificing partners in sacrificing ratio.`,
    isActive: true,
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'src_c12_acc_revaluation_realisation',
    title: 'NCERT & CBSE Accountancy: Revaluation, Realisation & Partner Capital Accounts',
    category: 'Marking Scheme',
    journey: 'CLASS_12',
    level: 'Class 12 CBSE',
    subject: 'Accountancy',
    chapter: 'Admission of a Partner',
    description: 'Marking schemes and rules for Revaluation A/c, Realisation A/c, Partners Capital A/c, Cash/Bank A/c, and Post-reconstitution Balance Sheets.',
    content: `CBSE CLASS 12 NCERT COMPREHENSIVE ACCOUNTING EVALUATION STANDARDS:
1. REVALUATION ACCOUNT (PROFIT & LOSS ADJUSTMENT A/C):
   - Debit side: Decrease in value of assets, Increase in amount of liabilities, Unrecorded liabilities brought into books.
   - Credit side: Increase in value of assets, Decrease in amount of liabilities, Unrecorded assets brought into books.
   - Balance (Profit or Loss on Revaluation) transferred strictly to Old Partners' Capital Accounts in OLD Profit Sharing Ratio.

2. REALISATION ACCOUNT (DISSOLUTION OF FIRM):
   - Step 1 (Transfer of Assets at Book Value): Debit Realisation A/c with all assets (except Cash/Bank, Fictitious Assets, Debit balance of P&L/Capital). Provision for Doubtful Debts transferred to Credit side.
   - Step 2 (Transfer of External Liabilities): Credit Realisation A/c with all 3rd-party liabilities (Creditors, B/P, Bank Loan, Partner's Wife Loan). Partner's loan is NOT transferred to Realisation A/c (paid directly).
   - Step 3 (Sale / Realisation of Assets): Credit Realisation A/c (By Bank A/c or By Partner's Capital A/c if taken over).
   - Step 4 (Payment of Liabilities): Debit Realisation A/c (To Bank A/c or To Partner's Capital A/c if assumed by partner). If nothing is stated about a liability, it MUST be paid at 100% book value.
   - Step 5 (Realisation Expenses): Debit Realisation A/c if borne by firm; if partner receives remuneration for dissolution, Debit Realisation with agreed remuneration.
   - Balance (Realisation Profit/Loss) transferred to ALL partners in profit sharing ratio.

3. PARTNERS' CAPITAL ACCOUNTS:
   - Fixed Capital Method: Two accounts maintained (Capital A/c and Current A/c). Capital account shows only permanent additions/withdrawals; all profits, interest, salary, drawings go through Current A/c.
   - Fluctuating Capital Method: Single Capital A/c per partner reflecting opening balance, additions, share of revaluation/goodwill/profits, drawings, and closing balance c/d.

4. GOODWILL & RECONSTITUTION ADJUSTMENTS:
   - Admission: Premium for Goodwill credited to Sacrificing Partners in Sacrificing Ratio [Sacrificing Ratio = Old Share - New Share].
   - Retirement / Death: Gaining Partners compensate Retiring/Deceased Partner in Gaining Ratio [Gaining Ratio = New Share - Old Share].
   - Deceased Partner Share of Profit up to death date = Dr. P&L Suspense A/c (or Gaining Partners' Capital if ratio changes), Cr. Deceased Partner's Capital A/c.`,
    isActive: true,
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'src_c12_acc_shares_cf',
    title: 'CBSE Accountancy: Share Capital & Cash Flow Statement Rubrics',
    category: 'Marking Scheme',
    journey: 'CLASS_12',
    level: 'Class 12 CBSE',
    subject: 'Accountancy',
    chapter: 'Cash Flow Statement',
    description: 'Marking scheme for Pro-rata allotment, Calls-in-Arrears, Forfeiture & Reissue of Shares, and AS-3 Cash Flow.',
    content: `CBSE EVALUATION RUBRIC FOR SHARE CAPITAL & CASH FLOW:
1. PRO-RATA & FORFEITURE:
   - 1 mark for calculating excess application money adjusted towards allotment.
   - 1.5 marks for calculating unpaid allotment amount per defaulting shareholder.
   - 1 mark for Share Forfeiture Journal Entry: Dr. Share Capital (Called-up amount), Cr. Calls in Arrears, Cr. Share Forfeiture.
   - Capital Reserve = (Gain on reissue per share) × Number of reissued shares.
2. CASH FLOW STATEMENT (AS-3 REVISED):
   - Operating Activities: Net profit before tax & extraordinary items -> Non-cash/Non-operating adjustments -> Working capital changes.
   - Investing Activities: Sale/Purchase of Fixed Assets & Non-current Investments.
   - Financing Activities: Issue/Redemption of Shares/Debentures, Dividend paid, Interest on borrowings paid.`,
    isActive: true,
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // ==========================================
  // CLASS 12 - BUSINESS STUDIES
  // ==========================================
  {
    id: 'src_c12_bst_principles',
    title: 'NCERT Business Studies: Fayol & Taylor Principles and Functions',
    category: 'Textbook',
    journey: 'CLASS_12',
    level: 'Class 12 CBSE',
    subject: 'Business Studies',
    chapter: 'Principles of Management',
    description: 'Key definitions, 14 Fayol principles, Taylor scientific techniques, and case study identification patterns.',
    content: `CBSE CLASS 12 BUSINESS STUDIES EVALUATION GUIDELINES:
1. PRINCIPLES OF MANAGEMENT:
   - Fayol: Unity of Command (single boss vs confusion), Unity of Direction (one head one plan), Espirit De Corps (team spirit), Scalar Chain with Gang Plank.
   - Taylor: Science not Rule of Thumb, Harmony not Discord, Cooperation not Individualism, Functional Foremanship (8 specialists - 4 planning, 4 execution), Time/Motion/Fatigue Study, Differential Piece Wage System.
2. CASE STUDY EVALUATION:
   - Step 1: Identify the underlying concept/principle correctly (1 mark).
   - Step 2: Quote relevant lines from the passage (1 mark).
   - Step 3: Explain the identified concept with 2-3 essential features or importance points (2-3 marks).
   - Semantic correctness is credited; exact word-to-word reproduction of NCERT sentences is NOT compulsory.`,
    isActive: true,
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // ==========================================
  // CLASS 12 - ECONOMICS
  // ==========================================
  {
    id: 'src_c12_eco_national_income',
    title: 'CBSE Macroeconomics: National Income & Money-Banking Standards',
    category: 'Marking Scheme',
    journey: 'CLASS_12',
    level: 'Class 12 CBSE',
    subject: 'Economics',
    chapter: 'National Income and Related Aggregates',
    description: 'Value Added, Income & Expenditure methods, Multiplier mechanism, CRR/SLR/Repo rate monetary tools.',
    content: `MACROECONOMICS EVALUATION CRITERIA:
1. NATIONAL INCOME CALCULATION:
   - Value Added Method: Value of Output (Sales + Change in Stock) - Intermediate Consumption = GVAmp.
   - Income Method: Compensation of Employees + Operating Surplus (Rent, Royalty, Interest, Profit) + Mixed Income = NDPfc.
   - Expenditure Method: C + I + G + (X - M) = GDPmp.
   - Conversion: Gross to Net (- Dep), Domestic to National (+ NFIA), MP to FC (- NIT).
2. MONETARY POLICY TOOLS (RBI):
   - Repo Rate / Bank Rate: Increasing repo rate -> makes commercial borrowing expensive -> money supply decreases -> controls inflation.
   - Cash Reserve Ratio (CRR) & Statutory Liquidity Ratio (SLR): Money multiplier = 1 / LRR.
3. NUMERICAL & REASONING:
   - Award step marks for formulas and intermediate steps. If calculation arithmetic fails in final step, award 60-70% credit.`,
    isActive: true,
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // ==========================================
  // CLASS 12 - ENGLISH & PHYSICAL EDUCATION
  // ==========================================
  {
    id: 'src_c12_english_writing',
    title: 'CBSE English Core: Writing Formats & Literature Rubrics',
    category: 'Marking Scheme',
    journey: 'CLASS_12',
    level: 'Class 12 CBSE',
    subject: 'English Core',
    chapter: 'Creative Writing: Notice, Invitation & Replies',
    description: 'Notice format (box, issuing org, date, heading), Letter to Editor, and literature thematic analysis.',
    content: `CBSE CLASS 12 ENGLISH MARKING RUBRIC:
1. NOTICE WRITING (4 MARKS):
   - Format (1 mark): Box, Name of issuing authority/organization, The word 'NOTICE', Date, Heading, Signature, Name and Designation.
   - Content (2 marks): What, When, Where, Whom to contact, relevant details without exceeding 50 words.
   - Expression (1 mark): Grammatical accuracy, vocabulary, and spelling.
2. LITERATURE (FLAMINGO & VISTAS):
   - Content relevance: Direct answers addressing the core theme of the question.
   - The Last Lesson: Importance of mother tongue, linguistic chauvinism.
   - Deep Water: William Douglas overcoming hydrophobia through determination.`,
    isActive: true,
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'src_c12_pe_rubric',
    title: 'CBSE Physical Education: Tournament Fixtures & Sports Physiology',
    category: 'Textbook',
    journey: 'CLASS_12',
    level: 'Class 12 CBSE',
    subject: 'Physical Education',
    chapter: 'Management of Sporting Events (Fixtures & Tournaments)',
    description: 'Knockout fixtures (formula for byes, upper/lower half), Yoga asanas, and sports injuries rehabilitation.',
    content: `CBSE PHYSICAL EDUCATION MARKING SCHEME:
1. KNOCKOUT TOURNAMENT FIXTURES:
   - Number of matches N - 1.
   - Number of Byes = Next power of 2 - Total teams (2^n - N).
   - Placement of Byes: 1st bye to bottom of lower half, 2nd bye to top of upper half, 3rd bye to top of lower half, 4th bye to bottom of upper half.
2. SPORTS INJURIES & FIRST AID:
   - Sprain (ligament injury) vs Strain (muscle/tendon injury).
   - P.R.I.C.E. Procedure: Protect, Rest, Ice, Compression, Elevation.`,
    isActive: true,
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // ==========================================
  // CLASS 12 - MATHEMATICS (CORE CBSE 041)
  // ==========================================
  {
    id: 'src_c12_maths_calculus',
    title: 'CBSE Class 12 Mathematics: Calculus, Integrals & Differential Equations Marking Rubric',
    category: 'Marking Scheme',
    journey: 'CLASS_12',
    level: 'Class 12 CBSE',
    subject: 'Mathematics',
    chapter: 'Integrals (Definite & Indefinite)',
    description: 'Official CBSE step-marking for Indefinite/Definite Integrals (properties), Integration by Parts, +C constant, and Homogeneous/Linear Differential Equations.',
    content: `CBSE CLASS 12 MATHEMATICS - CALCULUS EVALUATION STANDARDS:
1. INTEGRATION BY PARTS & INDEFINITE INTEGRALS:
   - Formula: ∫ u·v dx = u ∫ v dx - ∫ [ (du/dx) ∫ v dx ] dx (using ILATE priority rule).
   - Constant of Integration: Every indefinite integral step MUST conclude with '+ C'. Deduct 0.5 marks if '+ C' is omitted.
   - Partial Fractions: Correct splitting into A/(x-a) + B/(x-b) carries 1-1.5 step marks before integration.
2. DEFINITE INTEGRALS & PROPERTIES:
   - Property ∫_0^a f(x) dx = ∫_0^a f(a - x) dx: State property explicitly (1 mark), add equations (1 mark), simplify (1-2 marks).
   - Property ∫_{-a}^a f(x) dx = 2∫_0^a f(x) dx for even functions, and 0 for odd functions.
3. APPLICATION OF INTEGRALS (AREA UNDER CURVES):
   - Rough sketch of curve with intersection points: 1 mark.
   - Setting up integral limits and dx/dy strip: 1.5 marks.
   - Integration evaluation with sq. units: 1.5-2 marks.
4. DIFFERENTIAL EQUATIONS:
   - Linear Differential Equation: dy/dx + P(x)y = Q(x). Integrating Factor IF = e^(∫ P dx) (1.5 marks). General solution y × IF = ∫ (Q × IF) dx + C (1.5 marks).
   - Homogeneous: Substitution y = vx and dy/dx = v + x(dv/dx).`,
    isActive: true,
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'src_c12_maths_matrices_vectors_3d',
    title: 'CBSE Class 12 Mathematics: Matrices, Determinants, Vectors & 3D Geometry Rubric',
    category: 'Formula Sheet',
    journey: 'CLASS_12',
    level: 'Class 12 CBSE',
    subject: 'Mathematics',
    chapter: 'Three Dimensional Geometry (3D)',
    description: 'Matrix inverse method AX=B, Determinant properties, Skew lines shortest distance, and Direction Cosines/Ratios.',
    content: `CBSE CLASS 12 MATHEMATICS - MATRICES, VECTORS & 3D MARKING SCHEME:
1. SYSTEM OF LINEAR EQUATIONS (MATRIX METHOD AX = B):
   - Finding Determinant |A|: If |A| ≠ 0, system is consistent and unique solution exists (1 mark).
   - Matrix of Cofactors C_ij and Adjoint adj(A) = C^T (2 marks).
   - Inverse A^(-1) = (1/|A|) adj(A) (1 mark).
   - Multiplication X = A^(-1) B to obtain (x, y, z) values (2 marks).
2. 3D GEOMETRY - SHORTEST DISTANCE BETWEEN SKEW LINES:
   - Lines: r = a1 + λ b1 and r = a2 + μ b2.
   - Vector (a2 - a1) and Vector Cross Product (b1 × b2) calculation (2 marks).
   - Magnitude |b1 × b2| calculation (1 mark).
   - Formula: d = | (a2 - a1) · (b1 × b2) | / | b1 × b2 | (1.5 marks).
   - Final numeric distance with 'units' (0.5 mark).
3. VECTORS:
   - Dot product a · b = |a||b| cos θ. Projection of a on b = (a · b) / |b|.
   - Cross product a × b = |a||b| sin θ n_cap. Area of triangle = (1/2)|a × b|. Area of parallelogram = |a × b|.`,
    isActive: true,
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'src_c12_maths_lpp_probability',
    title: 'CBSE Class 12 Mathematics: Probability (Bayes Theorem) & Linear Programming',
    category: 'Marking Scheme',
    journey: 'CLASS_12',
    level: 'Class 12 CBSE',
    subject: 'Mathematics',
    chapter: 'Probability (Bayes Theorem & Distributions)',
    description: 'Bayes Theorem event framing, Conditional Probability, LPP Corner Point Feasible Region evaluation.',
    content: `CBSE CLASS 12 MATHEMATICS - PROBABILITY & LPP STANDARDS:
1. BAYES' THEOREM (5 MARKS QUESTION PATTERN):
   - Step 1: Defining mutually exclusive and exhaustive partition events E1, E2, ... and target event A (1 mark).
   - Step 2: Stating prior probabilities P(E1), P(E2) and conditional probabilities P(A|E1), P(A|E2) (1.5 marks).
   - Step 3: Stating Bayes' Theorem Formula: P(Ei|A) = [ P(Ei)·P(A|Ei) ] / [ Σ P(Ej)·P(A|Ej) ] (1 mark).
   - Step 4: Accurate substitution and fraction simplification to lowest terms (1.5 marks).
2. LINEAR PROGRAMMING PROBLEMS (LPP - 5 MARKS):
   - Formulation of objective function Max/Min Z = ax + by and subject to linear inequalities.
   - Accurate drawing of boundary lines on Cartesian axes with inequalities shaded: Feasible Region identified (2 marks).
   - Corner Points Table showing coordinates (x, y) and corresponding Z values (2 marks).
   - Final statement declaring Maximum or Minimum value of Z at corner point (x_0, y_0) (1 mark).
   - If feasible region is unbounded: Open half-plane condition ax + by > M check must be stated.`,
    isActive: true,
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // ==========================================
  // CA FOUNDATION - ACCOUNTING (ICAI)
  // ==========================================
  {
    id: 'src_ca_acc_icai',
    title: 'ICAI CA Foundation: Principles and Practice of Accounting (Study Material)',
    category: 'ICAI Study Material',
    journey: 'CA_FOUNDATION',
    level: 'CA Foundation ICAI',
    subject: 'Principles and Practice of Accounting',
    chapter: 'Accounting Process: Journal, Ledger, Trial Balance & Rectification',
    description: 'ICAI standards for Journal Entries, BRS, Inventories (AS-2), Depreciation (AS-10), Partnership Dissolution (Garner v Murray), NPO, and Company Accounts.',
    content: `ICAI CA FOUNDATION ACCOUNTING EVALUATION CRITERIA (PAPER 1):
1. STRICT ICAI FORMATTING & NARRATION:
   - Journal entries MUST have clear, concise narrations.
   - Rectification of Errors: Suspense Account treatment and effect on Profit & Loss Adjustment Account for prior period errors.
2. BANK RECONCILIATION STATEMENT (BRS):
   - Distinction between balance as per Cash Book and Pass Book (favourable vs overdraft).
   - Timing differences vs recording errors (cheques issued not presented, cheques deposited not cleared, bank charges, direct credits).
3. INVENTORY VALUATION (AS-2):
   - Inventories valued at Lower of Cost or Net Realizable Value (NRV). Cost formulas: FIFO or Weighted Average Price.
4. DEPRECIATION & AMORTISATION (AS-10):
   - Straight Line Method (SLM) & Written Down Value (WDV), change in method treated as change in accounting estimate.
5. PARTNERSHIP DISSOLUTION & ADVANCED TOPICS (CA EXCLUSIVE):
   - Insolvency of Partner: Application of Garner vs. Murray Rule (deficiency of insolvent partner borne by solvent partners in the ratio of their capitals standing just prior to dissolution).
   - Piecemeal Distribution of Cash: Maximum Loss Method & Proportionate Capital Method.
6. FINANCIAL STATEMENTS OF NPO & INCOMPLETE RECORDS:
   - Receipts & Payments A/c to Income & Expenditure A/c and Balance Sheet; Single Entry conversion method.
7. COMPANY ACCOUNTS (CA FOUNDATION NEW SCHEME):
   - Issue, Forfeiture & Reissue of Shares, Pro-rata allotment.
   - Redemption of Preference Shares and Debentures.
   - Accounting for Bonus Issue and Right Issue.`,
    isActive: true,
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // ==========================================
  // CA FOUNDATION - BUSINESS LAWS (ICAI)
  // ==========================================
  {
    id: 'src_ca_law_icai',
    title: 'ICAI CA Foundation: Business Laws & Case Analysis Framework',
    category: 'ICAI Study Material',
    journey: 'CA_FOUNDATION',
    level: 'CA Foundation ICAI',
    subject: 'Business Laws',
    chapter: 'Indian Contract Act, 1872: Nature of Contracts & Offer/Acceptance',
    description: 'Evaluation rules for Indian Contract Act 1872, Sale of Goods Act 1930, Partnership Act 1932, and Companies Act 2013.',
    content: `ICAI CA FOUNDATION BUSINESS LAWS ANSWER STRUCTURE:
1. 4-TIER CASE STUDY ANSWER FORMAT (MANDATORY FOR FULL CREDIT):
   - Part 1: Provision of Law (Cite relevant Section & Act name, e.g., "According to Section 2(h) of the Indian Contract Act, 1872...").
   - Part 2: Facts of the Case (Brief summary of the factual dispute in 2-3 lines).
   - Part 3: Analysis / Application (Apply the legal principle to the given facts).
   - Part 4: Conclusion (Clear, unambiguous final verdict answering the question asked).
2. KEY DOCTRINES & SECTIONS:
   - Balfour v. Balfour (Domestic agreements lack intention to create legal relations).
   - Free Consent: Coercion (Sec 15), Undue Influence (Sec 16), Fraud (Sec 17), Misrepresentation (Sec 18), Mistake (Sec 20-22).
   - Caveat Emptor & Exceptions under Sale of Goods Act, 1930.
   - Separate Legal Entity & Corporate Veil under Companies Act, 2013 (Salomon v. Salomon & Co. Ltd.).`,
    isActive: true,
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // ==========================================
  // CA FOUNDATION - QUANTITATIVE APTITUDE
  // ==========================================
  {
    id: 'src_ca_quant_icai',
    title: 'ICAI CA Foundation: Quantitative Aptitude & Time Value of Money Rubrics',
    category: 'Formula Sheet',
    journey: 'CA_FOUNDATION',
    level: 'CA Foundation ICAI',
    subject: 'Quantitative Aptitude',
    chapter: 'Time Value of Money: Simple/Compound Interest, Annuity & Sinking Fund',
    description: 'Formulas and shortcuts for TVM, Permutations/Combinations, AP/GP, Normal Distribution & Regression.',
    content: `CA FOUNDATION QUANTITATIVE APTITUDE STANDARDS:
1. TIME VALUE OF MONEY (HIGHEST WEIGHTAGE CHAPTER):
   - Compound Amount A = P(1 + i)^n where i = r/m, n = t×m.
   - Effective Rate of Interest E = (1 + i)^n - 1.
   - Future Value of Regular Annuity FVA = A × [((1 + i)^n - 1) / i].
   - Present Value of Regular Annuity PVA = A × [(1 - (1 + i)^(-n)) / i].
   - Sinking Fund & Amortization: Pmt = FVA / Annuity Factor.
2. STATISTICS & PROBABILITY:
   - Combined Mean X_bar = (N1*X1 + N2*X2) / (N1 + N2).
   - Standard Deviation SD = sqrt(Σ(x - x_bar)² / N).
   - Regression equations: (Y - y_bar) = byx (X - x_bar); where byx = r × (σy / σx).
   - Product of regression coefficients: byx × bxy = r².`,
    isActive: true,
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // ==========================================
  // CA FOUNDATION - BUSINESS ECONOMICS
  // ==========================================
  {
    id: 'src_ca_eco_icai',
    title: 'ICAI CA Foundation: Business Economics & Market Structures',
    category: 'ICAI Study Material',
    journey: 'CA_FOUNDATION',
    level: 'CA Foundation ICAI',
    subject: 'Business Economics',
    chapter: 'Price Determination in Different Markets (Perfect Competition, Monopoly, Monopolistic & Oligopoly)',
    description: 'Demand elasticity, Production ISO-quant, Cost curves (Envelope LAC), Oligopoly Kinked Demand Curve.',
    content: `CA FOUNDATION BUSINESS ECONOMICS CONCEPTS:
1. DEMAND ELASTICITY:
   - Price Elasticity Ep = (dQ/dP) × (P/Q). Point elasticity vs Arc elasticity.
   - Cross Elasticity: Positive for substitutes (Tea & Coffee), Negative for complements (Car & Petrol), Zero for unrelated goods.
2. PRODUCTION & COST:
   - Law of Variable Proportions (Short run) vs Returns to Scale (Long run: Cobb-Douglas function Q = A K^a L^b).
   - Long-run Average Cost (LAC) curve is known as the "Envelope Curve" or "Planning Curve".
3. MARKET EQUILIBRIUM:
   - Perfect Competition: P = AR = MR. Long run equilibrium at Minimum LAC (Zero Economic Profit).
   - Monopoly: MR = MC with downward sloping AR/MR. No supply curve.
   - Oligopoly: Paul Sweezy's Kinked Demand Curve explains price rigidity.`,
    isActive: true,
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // ==========================================
  // CA INTERMEDIATE - ICAI NEW SCHEME RUBRICS & STANDARDS
  // ==========================================
  {
    id: 'src_cainter_as14_amalgamation',
    title: 'ICAI CA Intermediate: AS 14 Accounting for Amalgamations & Reconstruction Rules',
    category: 'Marking Scheme',
    journey: 'CA_INTERMEDIATE',
    level: 'CA Intermediate ICAI',
    subject: 'Advanced Accounting',
    chapter: 'Accounting for Amalgamation of Companies (AS 14)',
    description: 'Official ICAI criteria for Net Payment vs Net Assets methods, Purchase Consideration components, and Liquidation expenses treatment.',
    content: `ICAI CA INTERMEDIATE ADVANCED ACCOUNTING - AS 14 & RECONSTRUCTION:
1. PURCHASE CONSIDERATION (AS 14):
   - Purchase consideration is the aggregate of the shares and other securities issued and payment made in the form of cash or other assets by the transferee company to the shareholders (both equity and preference) of the transferor company.
   - Payments made to creditors, debenture holders, or third parties do NOT form part of purchase consideration.
   - Liquidation expenses borne by the transferee company:
     * In nature of purchase: Debited to Goodwill / Capital Reserve Account.
     * In nature of merger: Debited to General Reserve / P&L Account.
2. TYPES OF AMALGAMATION:
   - Amalgamation in the Nature of Merger: Pooling of Interests method (all assets/liabilities taken at book value, minimum 90% equity shareholders agree).
   - Amalgamation in the Nature of Purchase: Purchase method (assets/liabilities taken at agreed values, difference between PC and Net Assets credited to Capital Reserve or debited to Goodwill).
3. INTERNAL RECONSTRUCTION (CAPITAL REDUCTION):
   - Requires Special Resolution and NCLT confirmation under Section 66 of Companies Act, 2013.
   - Sacrifices by shareholders, debenture holders, and creditors are credited to 'Capital Reduction A/c'.
   - Capital Reduction A/c is utilized to write off accumulated losses (P&L Dr balance), unamortized expenses, and overvalued assets.
   - Any surviving credit balance in Capital Reduction A/c is transferred to 'Capital Reserve A/c'.`,
    isActive: true,
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'src_cainter_taxation_115bac_gst',
    title: 'ICAI CA Intermediate: Section 115BAC Default Tax Regime & CGST ITC Provisions',
    category: 'Marking Scheme',
    journey: 'CA_INTERMEDIATE',
    level: 'CA Intermediate ICAI',
    subject: 'Taxation',
    chapter: 'Income Tax: Basic Concepts, Tax Rates & Section 115BAC Default Regime',
    description: 'Step-by-step ICAI rubrics for Section 115BAC individual tax calculation, standard deduction ₹75,000, and Section 17(5) blocked credits.',
    content: `ICAI CA INTERMEDIATE TAXATION MARKING RUBRIC:
1. SECTION 115BAC DEFAULT TAX REGIME (A.Y. 2025-26):
   - Standard deduction under Section 16(ia) is increased to ₹75,000 for salaried employees.
   - Deductions NOT ALLOWED: Section 80C, 80D, 80TTA, 24(b) interest on self-occupied house property, HRA, LTA.
   - Deduction ALLOWED: Section 80CCD(2) (employer's contribution to NPS up to 14% for Central Govt or 10% for others), standard deduction u/s 16(ia), family pension deduction u/s 57(iia) (up to ₹25,000).
   - Rebate u/s 87A: If total income <= ₹7,00,000, rebate of 100% of income tax (up to ₹25,000). Marginal relief available.
   - Slab Rates (A.Y. 2025-26):
     * Up to ₹3,00,000: Nil
     * ₹3,00,001 - ₹7,00,000: 5%
     * ₹7,00,001 - ₹10,00,000: 10%
     * ₹10,00,001 - ₹12,00,000: 15%
     * ₹12,00,001 - ₹15,00,000: 20%
     * Above ₹15,00,000: 30%
     * Add Health & Education Cess @ 4%.
2. GST - INPUT TAX CREDIT (CGST ACT 2017):
   - Section 16: Eligibility conditions: Tax invoice in possession, goods/services received, tax paid to govt by supplier, return filed u/s 39.
   - Section 17(5) Blocked Credits:
     * 17(5)(a): Motor vehicles for transport of persons (seating capacity <= 13) unless used for taxable supply of vehicles, driving school, or passenger transport.
     * 17(5)(b): Food & beverages, outdoor catering, health insurance — EXCEPT where obligatory for employer under any law (e.g. Factories Act).
     * 17(5)(h): Goods lost, stolen, destroyed, written off or disposed of by gift/free samples.`,
    isActive: true,
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'src_neet_nta_marking_rubric',
    title: 'NTA NEET (UG): Official Marking Scheme & Test Pattern Guidelines',
    category: 'Marking Scheme',
    journey: 'NEET',
    level: 'NEET (UG) Medical',
    subject: 'Biology',
    chapter: 'General NEET Exam Pattern & Marking Scheme',
    description: 'NTA NEET scoring rules: +4 for every correct response, -1 penalty for incorrect response, 0 for unattempted questions.',
    content: `NTA NEET (UG) OFFICIAL MARKING SCHEME & EVALUATION GUIDELINES:
1. TEST ARCHITECTURE:
   - Total Marks: 720 Marks (180 questions to be answered out of 200).
   - Physics: Section A (35 Questions, 140 Marks) + Section B (15 Questions, attempt any 10, 40 Marks) = 180 Marks.
   - Chemistry: Section A (35 Questions, 140 Marks) + Section B (15 Questions, attempt any 10, 40 Marks) = 180 Marks.
   - Biology (Botany + Zoology): Section A (35 + 35 = 70 Questions, 280 Marks) + Section B (15 + 15 = 30 Questions, attempt 10 + 10, 80 Marks) = 360 Marks.
2. MARKING RULES:
   - Correct Answer: +4 marks.
   - Incorrect Answer: -1 mark (Negative Marking).
   - Unattempted / Unanswered Question: 0 marks.
   - Multiple options marked: Treated as Incorrect Answer (-1 mark).
3. PEDAGOGICAL EVALUATION STANDARDS:
   - Assertion-Reasoning Questions: Evaluate whether Assertion is True, Reason is True, and whether Reason is the correct explanation of Assertion.
   - NCERT Line-by-Line Veracity: Exact terminology, scientist contributions, and diagram labels from NCERT Class 11 and 12 are binding.`,
    isActive: true,
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'src_neet_physics_chem_high_yield',
    title: 'NMC NEET (UG): Physics & Chemistry High-Yield Formulae & Mechanisms',
    category: 'Formula Sheet',
    journey: 'NEET',
    level: 'NEET (UG) Medical',
    subject: 'Physics',
    chapter: 'Current Electricity (Ohm\'s Law, Kirchhoff\'s Rules & Wheatstone Bridge)',
    description: 'High-frequency physics equations (Mechanics, Electrodynamics, Modern Physics) and Chemistry reaction mechanisms for NEET.',
    content: `NEET (UG) HIGH-YIELD FORMULAE & CONCEPT CHECKLIST:
1. PHYSICS:
   - Kinematics: v = u + at, s = ut + 0.5at², v² = u² + 2as. Projectile: Hmax = u²sin²θ/(2g), R = u²sin(2θ)/g, T = 2usinθ/g.
   - Work-Energy: W_net = ΔK. Friction: fs_max = μs×N, fk = μk×N.
   - Rotational: τ = Iα, L = Iω, KE_rot = 0.5 Iω². Moment of Inertia of Ring: MR², Disc: 0.5 MR², Solid Sphere: 2/5 MR².
   - Gravitation: F = G M1 M2 / r², g_h = g(1 - 2h/R), v_escape = sqrt(2gR).
   - Electrostatics: F = q1 q2 / (4πε0 r²), E = -dV/dr. Capacitor energy U = 0.5 C V² = Q² / (2C).
   - Current Electricity: V = IR, Drift velocity vd = eEτ/m, I = n e A vd. Kirchhoff\'s Junction (KCL) & Loop Rule (KVL).
   - Modern Physics: Einstein Photoelectric Eq: hν = Φ + KE_max; de Broglie λ = h / p = h / sqrt(2mqV).
2. CHEMISTRY:
   - Physical: PV = nRT, ΔG° = -nFE°cell = -2.303 RT log K. Nernst Eq: Ecell = E°cell - (0.0591/n) log Q at 298K.
   - Arrhenius: k = A e^(-Ea/RT). First Order: t_half = 0.693 / k.
   - Organic: SN1 mechanism (carbocation intermediate, racemisation, 3° > 2° > 1°), SN2 mechanism (backside attack, Walden inversion, 1° > 2° > 3°).
   - Markovnikov addition (electrophile adds to form more stable carbocation), Aldol condensation with α-hydrogen, Cannizzaro without α-hydrogen.`,
    isActive: true,
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // ==========================================
  // JEE (MAIN & ADVANCED) - ENGINEERING
  // ==========================================
  {
    id: 'src_jee_official_syllabus_rubric',
    title: 'NTA & IIT JEE: Official Marking Scheme & Question Archetype Rubric',
    category: 'Marking Scheme',
    journey: 'JEE',
    level: 'JEE Main & Advanced',
    subject: 'All Subjects',
    description: 'NTA JEE Main single-choice MCQs (+4, -1) and Numerical Value (+4, -1) rules along with IIT JEE Advanced Multi-correct and Integer rubrics.',
    content: `JEE (MAIN & ADVANCED) EXAMINATION ARCHITECTURE & EVALUATION RUBRIC:
1. JEE MAIN MARKING SCHEME (NTA STANDARD):
   - Section A (Single Correct MCQs): Correct Option = +4 Marks; Incorrect Option = -1 Mark (Negative Marking); Unattempted = 0 Marks.
   - Section B (Numerical Value Questions): Correct Answer rounded to specified decimal/integer = +4 Marks; Incorrect = -1 Mark; Unattempted = 0 Marks.
2. JEE ADVANCED MARKING SCHEME (IIT ARCHETYPE):
   - One or More Than One Correct (Partial Marking): Full Marks (+4) if all correct options are selected; Partial (+3, +2, +1) if only subsets of correct options are chosen and no incorrect option is selected; Negative (-2) if any incorrect option is selected.
   - Non-Negative Numerical / Integer Type: +3 or +4 Marks for exact numerical value; 0 Marks for incorrect; No negative marking in select integer sections.
   - Matrix Match / List Match: +3 Marks for correct matching; -1 for incorrect.
3. PROBLEM SOLVING EVALUATION RIGOR:
   - Physics: Coordinate systems, Free Body Diagrams (FBD), sign conventions in kinematics/optics, conservation laws applicability (momentum vs mechanical energy).
   - Chemistry: Mechanistic intermediates (carbocations, carbanions, free radicals, benzyne), stereochemical configuration (R/S, cis/trans, d/l), oxidation state tracking in inorganic coordination complexes.
   - Mathematics: Rigorous domain-range verification in equations, checking for extraneous roots, handling endpoint continuity in calculus, differentiability at sharp corners, and modular arithmetic.`,
    isActive: true,
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'src_jee_physics_maths_high_yield',
    title: 'IIT JEE: Advanced Physics & Mathematics High-Yield Master Formulas',
    category: 'Formula Sheet',
    journey: 'JEE',
    level: 'JEE Main & Advanced',
    subject: 'Physics',
    chapter: 'Rotational Dynamics (Torque, Moment of Inertia, Pure Rolling & Angular Momentum Conservation)',
    description: 'Master formula compendium for JEE Advanced Mechanics, Electrodynamics, Coordinate Geometry & Calculus.',
    content: `JEE ADVANCED HIGH-YIELD FORMULAE & CONCEPT COMPENDIUM:
1. JEE ADVANCED PHYSICS:
   - Mechanics: Pure Rolling condition v_cm = Rω, a_cm = Rα. Friction direction in rolling on inclined planes: a_cm = g sin θ / (1 + I_cm/(mR²)).
   - Conservation of Angular Momentum: L = r_cm × P_cm + I_cm ω. Collisions with hinges: Angular momentum conserved about the hinge.
   - Variable Mass: Rocket Equation v = v0 + u_rel ln(m0 / m) - gt.
   - Electrodynamics: Gauss's Law in dielectrics ∮ D·dA = q_free. Force between capacitor plates F = Q² / (2 ε0 A).
   - LC Oscillations: ω = 1/sqrt(LC), q(t) = Q0 cos(ωt).
   - Wave Optics: Young's double slit with slab of thickness t and refractive index μ: Shift Δy = (β/λ)(μ - 1)t = D(μ - 1)t / d.
2. JEE ADVANCED MATHEMATICS:
   - Calculus King's Property: ∫[a to b] f(x) dx = ∫[a to b] f(a + b - x) dx.
   - Leibniz Rule for differentiation under integral: d/dx [ ∫[u(x) to v(x)] f(t) dt ] = f(v(x))·v'(x) - f(u(x))·u'(x).
   - Coordinate Geometry: Parabola y² = 4ax tangent y = mx + a/m; Ellipse x²/a² + y²/b² = 1 tangent y = mx ± sqrt(a²m² + b²); Hyperbola x²/a² - y²/b² = 1 tangent y = mx ± sqrt(a²m² - b²).
   - Vectors & 3D: Shortest distance between skew lines r = a1 + λ b1 and r = a2 + μ b2 is d = | (a2 - a1)·(b1 × b2) | / | b1 × b2 |.
   - Complex Numbers: Cube roots of unity 1, ω, ω² where 1 + ω + ω² = 0, ω³ = 1. Distance formula |z1 - z2|. Equation of circle |z - z0| = r.`,
    isActive: true,
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'src_jee_chemistry_reactions_mechanisms',
    title: 'IIT JEE: Organic Reaction Mechanisms & Physical Equilibrium Master Guide',
    category: 'Revision Notes',
    journey: 'JEE',
    level: 'JEE Main & Advanced',
    subject: 'Chemistry',
    chapter: 'General Organic Chemistry (GOC: Carbocations, Carbanions, Free Radicals Stability & Acidity/Basicity Comparisons)',
    description: 'Reaction pathways (Aldol, Cannizzaro, Pinacol, Hoffmann, Grignard), Crystal Field Splitting, and Chemical Thermodynamics.',
    content: `JEE ADVANCED CHEMISTRY MECHANISMS & THERMODYNAMICS:
1. ORGANIC MECHANISMS:
   - Carbocation Rearrangements: 1,2-hydride shift, 1,2-methyl shift, ring expansion (4-membered to 5-membered, 5-membered to 6-membered) driven by thermodynamic stability.
   - Electrophilic Aromatic Substitution (EAS): -OH, -NH2, -OCH3 are strongly activating ortho/para-directing; -NO2, -CN, -CHO are meta-directing; Halogens are deactivating but ortho/para-directing due to lone pair resonance vs strong -I effect.
   - Nucleophilic Acyl Substitution: Reactivity of Carboxylic Acid Derivatives: Acyl chloride > Acid anhydride > Ester > Amide.
2. INORGANIC COORDINATION:
   - Crystal Field Splitting Energy (CFSE): Octahedral Δo vs Tetrahedral Δt = (4/9) Δo.
   - Strong field ligands (CN-, CO, NO2-, en) cause pairing of electrons (Low Spin complexes); Weak field ligands (I-, Br-, Cl-, F-, H2O) yield High Spin complexes.
3. PHYSICAL CHEMISTRY:
   - Thermodynamics: ΔS_universe = ΔS_system + ΔS_surroundings ≥ 0. For spontaneous process at const T & P: ΔG = ΔH - TΔS < 0.
   - Nernst Equation: E_cell = E°_cell - (RT / nF) ln Q. At 298 K: E_cell = E°_cell - (0.0591 / n) log10 Q.`,
    isActive: true,
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'src_cuet_general_test_marking_scheme',
    title: 'NTA CUET (UG): General Test (Section III) Official Marking & Reasoning Standards',
    category: 'Marking Scheme',
    journey: 'CUET',
    level: 'CUET (UG) NTA',
    subject: 'General Test (Section III)',
    chapter: 'Percentages, Profit and Loss & Discount Calculations',
    description: 'NTA Official +5 / -1 Marking criteria, speed shortcuts, Venn diagram deductions, and data interpretation methodology.',
    content: `NATIONAL TESTING AGENCY (NTA) CUET (UG) - SECTION III GENERAL TEST STANDARDS:
1. OFFICIAL MARKING SCHEME:
   - Correct Option: +5 Marks
   - Incorrect Option: -1 Mark (Negative Marking)
   - Unattempted / Marked for Review: 0 Marks
   - If more than one option is correct: +5 marks awarded to all candidates who marked any of the correct options.

2. QUANTITATIVE APTITUDE SHORTCUTS & FORMULAS:
   - Percentages & Profit/Loss: Profit % = (Profit / CP) * 100. Marked Price MP = CP * (100 + Markup%) / 100. Effective discount for successive discounts d1, d2 = (d1 + d2 - (d1*d2)/100)%.
   - Simple & Compound Interest: SI = (P * R * T)/100. CI Amount A = P(1 + R/100)^T. Difference between CI & SI for 2 years = P(R/100)².
   - Time, Speed & Distance: Speed = Distance / Time. Average speed for equal distance = 2xy / (x + y). Relative speed when moving in same direction = (u - v), opposite direction = (u + v).
   - Time & Work: If A takes x days and B takes y days, together they take (xy)/(x+y) days. Work done = Rate * Time.

3. LOGICAL REASONING RULES:
   - Syllogisms: All A are B (Universal Affirmative). No A is B (Universal Negative). Some A are B (Particular Affirmative). Some A are not B (Particular Negative).
   - Coding-Decoding: Check forward (+1, +2, +3), reverse (-1, -2, -3), and opposite letter positions (A=Z, B=Y, C=X using sum = 27).
   - Blood Relations: Standardize family tree with (+) for male, (-) for female, (=) for spouse, (|) for generation descent.

4. CURRENT AFFAIRS & GENERAL KNOWLEDGE:
   - Indian Constitution: Fundamental Rights (Articles 12-35), Directive Principles of State Policy (Articles 36-51), Preamble keywords (Sovereign, Socialist, Secular, Democratic, Republic).
   - Economy: Monetary policy tools by RBI (Repo, Reverse Repo, CRR, SLR), Union Budget terminology (Fiscal Deficit = Total Expenditure - Total Receipts excluding borrowings).`,
    isActive: true,
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'src_cuet_english_reading_verbal_ability',
    title: 'CUET (UG) English Language: Verbal Ability, Comprehension & Grammar Rules',
    category: 'Revision Notes',
    journey: 'CUET',
    level: 'CUET (UG) NTA',
    subject: 'English Language (Section IA)',
    chapter: 'Reading Comprehension: Factual Passages & Data Inferences',
    description: 'Factual & literary passage heuristics, tone identification, para-jumbles linking words, and high-frequency CUET vocabulary.',
    content: `CUET ENGLISH LANGUAGE (SECTION IA) PREPARATION MANUAL:
1. READING COMPREHENSION TECHNIQUES:
   - Factual Passages: Scan keywords in the question prompt before reading the passage; locate direct data, dates, statistics, and verifiable claims.
   - Narrative & Literary Passages: Identify author's purpose (Informative, Persuasive, Critical, Satirical, Nostalgic, Laudatory, Objective).
   - Inference-based Questions: The correct option is supported by text evidence without assuming unsubstantiated extreme extrapolations (watch out for "always", "never", "only").

2. PARA JUMBLES / REARRANGING PARTS:
   - Mandatory Pairs: Identify pronoun-noun antecedents (e.g. "Dr. Kalam... He...").
   - Chronological & Logical Connectors: "First, Consequently, Moreover, However, On the other hand, Therefore, In conclusion".
   - Independent Opening Sentence: Must introduce the central theme without unresolved relative pronouns or contrast conjunctions.

3. VOCABULARY & IDIOMATIC USAGE:
   - High-yield CUET Synonyms/Antonyms:
     * Ephemeral (Transient, Fleeting) <-> Eternal, Perennial
     * Ubiquitous (Omnipresent, Pervasive) <-> Rare, Scarce
     * Pragmatic (Practical, Realistic) <-> Idealistic, Quixotic
     * Ambiguous (Equivocal, Obscure) <-> Lucid, Explicit, Unambiguous
   - Common Idioms: 'Burn the midnight oil' (study hard late), 'Bite the bullet' (face unavoidable hardship), 'A blessing in disguise' (good outcome from bad start).`,
    isActive: true,
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'src_cuet_economics_business_domain_guide',
    title: 'CUET (UG) Commerce & Economics Domain: High-Yield NCERT Master Notes',
    category: 'Revision Notes',
    journey: 'CUET',
    level: 'CUET (UG) NTA',
    subject: 'Economics & Business Economics',
    chapter: 'National Income Aggregates & Measurement Methods (Value Added, Income, Expenditure)',
    description: 'NCERT aligned Macroeconomics aggregates, Keynesian multiplier formulas, Consumer Protection Act 2019, and Fayol vs Taylor principles.',
    content: `CUET (UG) DOMAIN COMMERCE & ECONOMICS MASTER SUMMARY:
1. MACROECONOMICS:
   - National Income: GDP_mp = Gross Domestic Product at Market Price. NNP_fc = National Income = GDP_mp - Depreciation - Net Indirect Taxes (NIT = Indirect Taxes - Subsidies) + Net Factor Income from Abroad (NFIA).
   - Keynesian Multiplier: k = 1 / (1 - MPC) = 1 / MPS. Since MPC + MPS = 1.
   - Money Supply: M1 = Currency with Public + Demand Deposits with Commercial Banks + Other Deposits with RBI. Money Multiplier = 1 / LRR.

2. BUSINESS STUDIES & MANAGEMENT:
   - Henri Fayol's 14 Principles: Division of Work, Authority & Responsibility, Discipline, Unity of Command (one boss), Unity of Direction (one head one plan), Subordination of Individual Interest, Remuneration, Centralisation, Scalar Chain (Gang Plank for emergency), Order, Equity, Stability of Personnel, Initiative, Esprit de Corps.
   - F.W. Taylor's Scientific Management: Science not rule of thumb, Harmony not discord, Cooperation not individualism, Development of each person to greatest efficiency. Techniques: Functional Foremanship (8 specialists), Time Study, Motion Study, Fatigue Study, Differential Piece Wage System.
   - Consumer Protection Act 2019: District Commission (claims up to ₹1 Crore), State Commission (₹1 Crore to ₹10 Crore), National Commission (exceeding ₹10 Crore).`,
    isActive: true,
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'src_cafinal_financial_reporting_indas_guide',
    title: 'CA Final Paper 1: Ind AS 115, 116, 109 & 103 Master Evaluation Standards',
    category: 'Marking Scheme',
    journey: 'CA_FINAL',
    level: 'CA Final (ICAI New Scheme)',
    subject: 'Financial Reporting (Paper 1)',
    chapter: 'Ind AS 115: Revenue from Contracts with Customers (5-Step Framework)',
    description: 'ICAI 5-step revenue recognition criteria, lease liability remeasurement, ECL 3-stage model, and business combination goodwill calculations.',
    content: `ICAI CA FINAL FINANCIAL REPORTING (PAPER 1) EVALUATION CRITERIA:
1. IND AS 115: REVENUE FROM CONTRACTS WITH CUSTOMERS (5-STEP MODEL):
   - Step 1: Identify contract with customer (Enforceability, commercial substance, approved terms, collection probable).
   - Step 2: Identify separate performance obligations (Distinct goods/services).
   - Step 3: Determine transaction price (Adjust for Variable Consideration using Expected Value or Most Likely Amount; constrain variable consideration if significant reversal probable; Significant Financing Component adjustment).
   - Step 4: Allocate transaction price to performance obligations based on relative standalone selling prices (SSP).
   - Step 5: Recognise revenue when/as performance obligations are satisfied (Over Time vs At a Point in Time).

2. IND AS 116: LEASES:
   - Initial Measurement: ROU Asset = Initial Lease Liability + Initial direct costs + Restoration estimate - Lease incentives received.
   - Lease Liability = Present Value of lease payments discounted at Interest Rate Implicit in Lease (or Lessee's Incremental Borrowing Rate).
   - Subsequent Measurement: Lease Liability increases by unwinding of interest (Finance Cost in P&L) and decreases by lease rental payments. ROU Asset depreciated over shorter of lease term or useful life.

3. IND AS 109: FINANCIAL INSTRUMENTS & ECL MODEL:
   - Classification: Based on Business Model Test & Solely Payments of Principal & Interest (SPPI) Test.
   - 3-Stage Expected Credit Loss (ECL):
     * Stage 1: Performing (12-month ECL, interest on gross carrying amount).
     * Stage 2: Underperforming / Significant Increase in Credit Risk (SICR) (Lifetime ECL, interest on gross carrying amount).
     * Stage 3: Credit-Impaired / Default (Lifetime ECL, interest on net carrying amount after ECL deduction).

4. IND AS 103: BUSINESS COMBINATIONS:
   - Purchase Consideration (Fair value of shares issued, cash, deferred consideration at PV, contingent consideration at fair value).
   - Goodwill / Gain on Bargain Purchase = Purchase Consideration + Non-Controlling Interest (NCI at Fair Value or Proportionate Net Assets) + Fair Value of Previously Held Equity Interest - Net Identifiable Assets Acquired at Fair Value.`,
    isActive: true,
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'src_cafinal_afm_forex_derivatives_handbook',
    title: 'CA Final Paper 2: AFM Forex Risk Management, Arbitrage & Option Pricing',
    category: 'Formula Sheet',
    journey: 'CA_FINAL',
    level: 'CA Final (ICAI New Scheme)',
    subject: 'Advanced Financial Management (Paper 2)',
    chapter: 'Forex Hedging: Forward Cover, Money Market Hedge vs Currency Option Hedge',
    description: 'Triangular arbitrage verification, Interest Rate Parity formulas, Money Market Hedge step sequence, and Black-Scholes Greeks.',
    content: `CA FINAL ADVANCED FINANCIAL MANAGEMENT (PAPER 2) FORMULAS & MECHANISMS:
1. FOREIGN EXCHANGE RISK MANAGEMENT & ARBITRAGE:
   - Triangular Arbitrage: Convert Base Currency -> Cross Currency 1 -> Cross Currency 2 -> Base Currency. If Net Inflow > Initial Outflow, Arbitrage Gain exists.
   - Interest Rate Parity (IRP): Forward Rate F = Spot Rate S * [(1 + Rh) / (1 + Rf)], where Rh is home currency interest rate and Rf is foreign currency interest rate.
   - Forward Premium / Discount % = [(Forward - Spot) / Spot] * (12 / n) * 100.
   - Money Market Hedge (MMH) for Accounts Receivable (Foreign Currency Inflow):
     * Step 1: Borrow Foreign Currency (Discounted at Foreign Borrowing Rate for n months: Inflow / (1 + Rf_borrow * n/12)).
     * Step 2: Convert borrowed foreign currency to Home Currency at current Spot Bid rate.
     * Step 3: Invest converted Home Currency at Home Deposit Rate for n months.
     * Step 4: Pay off foreign loan using foreign customer receivable on maturity.

2. DERIVATIVES & OPTION VALUATION:
   - Put-Call Parity: C + PV(X) = P + S (Call Price + Present Value of Strike = Put Price + Spot Price).
   - Black-Scholes Model: C = S * N(d1) - X * e^(-rt) * N(d2), where d1 = [ln(S/X) + (r + σ²/2)t] / (σ√t) and d2 = d1 - σ√t.
   - Option Greeks: Delta (Δ = ∂C/∂S), Gamma (Γ = ∂²C/∂S²), Vega (ν = ∂C/∂σ), Theta (θ = ∂C/∂t), Rho (ρ = ∂C/∂r).

3. PORTFOLIO THEORY & PERFORMANCE MEASURES:
   - Capital Asset Pricing Model (CAPM): Expected Return E(R) = Rf + β * [E(Rm) - Rf].
   - Beta Calculation: β = Cov(Ri, Rm) / Var(Rm) = (r_im * σ_i) / σ_m.
   - Sharpe Ratio = (Rp - Rf) / σ_p (Reward to Total Risk).
   - Treynor Ratio = (Rp - Rf) / β_p (Reward to Systematic Risk).
   - Jensen's Alpha = Actual Return Rp - [Rf + β_p * (Rm - Rf)].`,
    isActive: true,
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'src_cafinal_direct_tax_international_standards',
    title: 'CA Final Paper 4: Direct Tax Laws, Transfer Pricing & International Tax Rules',
    category: 'Revision Notes',
    journey: 'CA_FINAL',
    level: 'CA Final (ICAI New Scheme)',
    subject: 'Direct Tax Laws & International Taxation (Paper 4)',
    chapter: 'Transfer Pricing: Arm\'s Length Price (ALP) Methods & Most Appropriate Method (MAM)',
    description: 'Arm\'s length price determination methods (TNMM, CUP, CPM), Secondary Adjustment Section 92CE, Section 91 Unilateral DTAA relief calculation.',
    content: `CA FINAL DIRECT TAX LAWS & INTERNATIONAL TAXATION (PAPER 4) ESSENTIALS:
1. TRANSFER PRICING & ARM'S LENGTH PRICE (SECTION 92C):
   - Comparable Uncontrolled Price (CUP) Method: Compare price charged in controlled transaction with uncontrolled transaction between independent parties under comparable circumstances.
   - Transactional Net Margin Method (TNMM): Examines net profit margin relative to an appropriate base (e.g. costs, sales, assets).
   - Safe Harbour Rules (Section 92CB) & Advance Pricing Agreements (Section 92CC / 92CD).
   - Secondary Adjustment (Section 92CE): Required where primary adjustment > ₹1 Crore and relates to AY 2017-18 or later. Excess money available with AE must be repatriated to India within 90 days; if not repatriated, treated as advance and interest imputed (SBI 1-year MCLR + 3.25% if INR, or 6-month LIBOR/SOFR + 3% if foreign currency).

2. DOUBLE TAXATION RELIEF:
   - Bilateral Relief (Section 90 / 90A): As per terms of DTAA (Exemption Method or Tax Credit Method).
   - Unilateral Relief (Section 91): Available to Indian Residents when income accrues/arises abroad in a country with which India has NO DTAA.
   - Section 91 Relief Formula: Doubly Taxed Income * Lower of (Indian Average Rate of Tax or Foreign Country Rate of Tax).

3. SECTION 115BAA CONCESSIONAL CORPORATE TAX:
   - Tax Rate: 22% + 10% Surcharge + 4% HEC = Effective 25.168%.
   - Conditions: No claim for deductions under Section 10AA, 32(1)(iia) (additional depreciation), 32AD, 33AB, 35(1)(ii)/(iia)/(iii), 35(2AA), 35CCC, 35CCD, or Chapter VI-A deductions except 80JJAA and 80M. MAT provisions u/s 115JB not applicable.`,
    isActive: true,
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'src_c12_sci_cbse_master_syllabus',
    title: 'CBSE Class 12 Science: Official Rationalized Syllabus & Deleted Topics Guard (Physics, Chemistry, Maths, Biology)',
    category: 'Official Syllabus',
    journey: 'CLASS_12_SCIENCE',
    level: 'Class 12 CBSE (Science)',
    subject: 'All Subjects',
    chapter: 'Official Curriculum Blueprint & Rationalized Guidelines',
    description: 'CBSE 2025-26 Rationalized syllabus for Class 12 Science (PCM/PCB) with strict exclusion of deleted chapters (Solid State, Surface Chemistry, Metallurgy, Polymers, Chemistry in Everyday Life).',
    content: `CBSE CLASS 12 SCIENCE - OFFICIAL 2025-2026 RATIONALIZED SYLLABUS & EVALUATION BLUEPRINT

1. PHYSICS (SUBJECT CODE 042 - 70 MARKS THEORY):
   - Unit 1: Electrostatics (Ch 1: Electric Charges & Fields, Ch 2: Electrostatic Potential & Capacitance)
   - Unit 2: Current Electricity (Ch 3: Current Electricity) - Combined Unit 1+2 = 16 Marks
   - Unit 3: Magnetic Effects of Current & Magnetism (Ch 4 & 5)
   - Unit 4: Electromagnetic Induction & Alternating Currents (Ch 6 & 7) - Combined Unit 3+4 = 17 Marks
   - Unit 5: Electromagnetic Waves (Ch 8)
   - Unit 6: Optics (Ch 9: Ray Optics, Ch 10: Wave Optics) - Combined Unit 5+6 = 18 Marks
   - Unit 7: Dual Nature of Radiation & Matter (Ch 11)
   - Unit 8: Atoms & Nuclei (Ch 12 & 13) - Combined Unit 7+8 = 12 Marks
   - Unit 9: Electronic Devices (Ch 14: Semiconductor Electronics - Material, Devices and Simple Circuits) = 7 Marks
   - ❌ STRICTLY DELETED TOPICS: Potentiometer, Cyclotron, Earth's Magnetism details (tangent galvanometer), Van de Graaff generator, Color coding of resistors, Transistor amplifiers/switches, Logic gates (integrated circuits).

2. CHEMISTRY (SUBJECT CODE 043 - 70 MARKS THEORY):
   - Physical Chemistry (23 Marks): Solutions (7 M), Electrochemistry (9 M), Chemical Kinetics (7 M)
   - Inorganic Chemistry (14 Marks): d and f Block Elements (7 M), Coordination Compounds (7 M)
   - Organic Chemistry (33 Marks): Haloalkanes & Haloarenes (6 M), Alcohols, Phenols & Ethers (6 M), Aldehydes, Ketones & Carboxylic Acids (8 M), Amines (6 M), Biomolecules (7 M)
   - ❌ STRICTLY DELETED CHAPTERS / TOPICS:
     * Solid State (Entire Chapter DELETED)
     * Surface Chemistry (Entire Chapter DELETED)
     * General Principles & Processes of Isolation of Elements / Metallurgy (Entire Chapter DELETED)
     * Polymers (Entire Chapter DELETED)
     * Chemistry in Everyday Life (Entire Chapter DELETED)
     * p-Block Elements (Class 12 portion completely dropped from CBSE board)

3. MATHEMATICS (SUBJECT CODE 041 - 80 MARKS THEORY):
   - Unit 1: Relations & Functions (8 Marks) - Relations & Functions, Inverse Trigonometric Functions
   - Unit 2: Algebra (10 Marks) - Matrices, Determinants
   - Unit 3: Calculus (35 Marks) - Continuity & Differentiability, Applications of Derivatives, Integrals, Applications of Integrals, Differential Equations
   - Unit 4: Vectors & 3-D Geometry (14 Marks) - Vectors, Three-Dimensional Geometry
   - Unit 5: Linear Programming (5 Marks)
   - Unit 6: Probability (8 Marks)
   - ❌ STRICTLY DELETED TOPICS: Composite functions & invertible functions (fog/gof inverse derivations), Rolle's and Lagrange's Mean Value Theorems, Tangents & Normals (Applications of Derivatives), Limit of a sum as definite integral, Plane in 3D geometry (coplanarity, equation of a plane, angle between plane and line - only Line in 3D retained), Variance and Standard Deviation in Probability distribution (only mean/Bernoulli removed).

4. BIOLOGY (SUBJECT CODE 044 - 70 MARKS THEORY):
   - Unit 6: Reproduction (16 Marks) - Sexual Reproduction in Flowering Plants, Human Reproduction, Reproductive Health
   - Unit 7: Genetics & Evolution (20 Marks) - Principles of Inheritance & Variation, Molecular Basis of Inheritance, Evolution
   - Unit 8: Biology and Human Welfare (12 Marks) - Human Health and Disease, Microbes in Human Welfare
   - Unit 9: Biotechnology and its Applications (12 Marks) - Principles and Processes, Applications in Health & Agriculture
   - Unit 10: Ecology and Environment (10 Marks) - Organisms and Populations, Ecosystem, Biodiversity and Conservation
   - ❌ STRICTLY DELETED CHAPTERS: Reproduction in Organisms (Ch 1), Strategies for Enhancement in Food Production (Ch 9), Environmental Issues (Ch 16).`,
    isActive: true,
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'src_c12_sci_stepwise_marking_scheme',
    title: 'CBSE Class 12 Science: Official Step-Wise Marking Rubric & Derivation Evaluation Rules',
    category: 'Marking Scheme',
    journey: 'CLASS_12_SCIENCE',
    level: 'Class 12 CBSE (Science)',
    subject: 'All Subjects',
    chapter: 'Step-Wise Marking & Evaluation Guidelines',
    description: 'CBSE official answer checking protocols for Physics derivations, Chemistry reaction mechanisms, and Mathematics step-by-step proofs.',
    content: `CBSE CLASS 12 SCIENCE - OFFICIAL STEP-WISE MARKING PROTOCOLS & EVALUATION STANDARDS

1. PHYSICS EVALUATION RULES:
   - Diagram Requirement: For derivations (e.g., Electric Field due to Dipole, Lens Maker's Formula, Huygens' Principle, Prism refraction, Galvanometer to Ammeter), labeled diagram carries 0.5 to 1 mark. If diagram is missing or wrong, deduction applies even if mathematical part is correct.
   - Formula Stating: Writing the core governing formula/law (e.g., Gauss's Law, Biot-Savart Law, Ampere's Circuital Law) = 0.5 - 1 Mark.
   - Intermediate Calculus/Algebra: Clear substitution of variables and limits = 1 - 1.5 Marks.
   - Final Answer with Correct SI Unit: 0.5 Mark strictly allocated for unit. If numerical value is correct but unit is omitted or incorrect (e.g., writing 5 instead of 5 N/C or 5 A), deduct 0.5 Mark only.
   - Partial Credit: If student makes an algebraic/arithmetic slip in step 3 but subsequent steps follow correct logic, award 70-80% marks for the question.

2. CHEMISTRY EVALUATION RULES:
   - IUPAC & Reaction Mechanism: Curved arrow notation in organic mechanisms (e.g., SN1, SN2, dehydration of alcohols, acid-catalyzed hydration) must show proper electron transfer.
   - Chemical Equations: Must be balanced with reagents and conditions (catalyst, temperature) clearly noted.
   - Name Reactions: Explicit recognition of reactants, key intermediate, and final product (e.g., Aldol condensation, Cannizzaro, Sandmeyer, Reimer-Tiemann, Kolbe's reaction).
   - Numerical Problems (Solutions, Electrochemistry, Kinetics):
     * Step 1: Writing the correct formula (e.g., Nernst Equation: E_cell = E°_cell - (0.0591/n) log Q, Arrhenius equation, Raoult's law) = 1 Mark.
     * Step 2: Correct substitution with units = 1 Mark.
     * Step 3: Final arithmetic calculation with units (e.g., V, mol L⁻¹ s⁻¹, kJ/mol) = 1 Mark.

3. MATHEMATICS EVALUATION RULES:
   - Derivation & Proofs: State domain/continuity conditions before applying theorems.
   - Integration: Adding constant of integration (+ C) for indefinite integrals is mandatory (0.5 mark deduction if omitted).
   - Matrix Operations: Clearly show row/column operations step-by-step; do not skip intermediate determinant expansions.
   - Differential Equations: Writing separating variables or integrating factor (I.F. = e^∫P dx) carries 1-1.5 marks.
   - Direct Answers: Direct answer without showing intermediate integration steps or derivative formulas receives penalty.`,
    isActive: true,
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'src_c11_arts_cbse_master_syllabus',
    title: 'CBSE Class 11 Arts / Humanities: Official 2025-26 Rationalized Syllabus & Deleted Topics Guard',
    category: 'Official Syllabus',
    journey: 'CLASS_11_ARTS',
    level: 'Class 11 CBSE (Humanities)',
    subject: 'All Subjects',
    chapter: 'Official Curriculum Blueprint & Deleted Topics Blacklist',
    description: 'Complete official CBSE rationalized syllabus for Class 11 History (027), Political Science (028), Geography (029), Sociology (039), Psychology (037), Economics (030), and English Core (301). Contains explicit lists of deleted/excluded topics.',
    content: `CBSE CLASS 11 ARTS (HUMANITIES) - OFFICIAL 2025-2026 RATIONALIZED SYLLABUS & BLUEPRINT

1. HISTORY (SUBJECT CODE 027 - THEMES IN WORLD HISTORY - 80 Marks):
   - Section 1: Early Societies
     * Theme 1: Writing and City Life (Mesopotamia: Urbanisation, Trading, Cuneiform, Legacy)
   - Section 2: Classical Empires
     * Theme 2: An Empire Across Three Continents (Roman Empire: Political History, Gender, Slavery, Late Antiquity)
     * Theme 3: Nomadic Empires (The Mongols, Genghis Khan, Military System, Yasa, Trade Networks)
   - Section 3: Changing Traditions
     * Theme 4: The Three Orders (Feudal Society in Europe: Clergy, Nobility, Peasants, Manors, 14th Century Crisis)
     * Theme 5: Changing Cultural Traditions (Renaissance Italy, Humanism, Science, Printing Press, Women's Status)
     * Theme 6: Displacing Indigenous Peoples (European Colonisation in North America & Australia, Reservations)
   - Section 4: Towards Modernisation
     * Theme 7: Paths to Modernisation (Comparative Modernisation: Meiji Japan, Qing China to Communist Revolution)
   - ❌ CRITICAL DELETED TOPICS:
     * Theme 1: "From the Beginning of Time" (Early Human Evolution) - COMPLETELY REMOVED!
     * Theme 4: "Central Islamic Lands" (Rise of Islam & Caliphate) - COMPLETELY REMOVED!
     * Theme 8: "Confrontation of Cultures" (Aztecs/Incas) - COMPLETELY REMOVED!
     * Theme 9: "The Industrial Revolution" (Separate chapter removed, integrated into modern paths).

2. POLITICAL SCIENCE (SUBJECT CODE 028 - 80 Marks):
   - Part A: Indian Constitution at Work (40 Marks):
     * Constitution: Why and How? & Rights in the Indian Constitution (Fundamental Rights, DPSP, Writs)
     * Election and Representation (FPTP vs PR, Election Commission)
     * Executive (Presidential vs Parliamentary, PM, Council of Ministers, Civil Services)
     * Legislature (Bicameralism, Law-making process, Parliamentary Committees)
     * Judiciary (Judicial Independence, Supreme Court Powers, PIL, Judicial Activism)
     * Federalism (Centre-State Dynamics, Special Provisions)
     * Local Governments (73rd & 74th Amendments, PRIs, Urban Local Bodies)
     * Constitution as a Living Document & Philosophy of Constitution
   - Part B: Political Theory (40 Marks):
     * Political Theory: Introduction, Freedom (Negative/Positive, Harm Principle), Equality, Social Justice (Rawls), Rights, Citizenship, Nationalism, Secularism.
   - ❌ CRITICAL DELETED TOPICS:
     * "Peace" (Chapter 9) & "Development" (Chapter 10) in Political Theory have been deleted from examination weightage.

3. GEOGRAPHY (SUBJECT CODE 029 - 70 Marks):
   - Book 1: Fundamentals of Physical Geography (35 Marks)
   - Book 2: India: Physical Environment (35 Marks)
   - Practical Geography (30 Marks Internal)

4. SOCIOLOGY (SUBJECT CODE 039 - 80 Marks):
   - Book 1: Introducing Sociology (40 Marks)
   - Book 2: Understanding Society (40 Marks)

5. PSYCHOLOGY (SUBJECT CODE 037 - 70 Marks):
   - Unit 1 to Unit 8: What is Psychology, Methods of Enquiry, Human Development, Sensory & Perceptual Processes, Learning, Memory, Thinking, Motivation & Emotion.

6. ECONOMICS (SUBJECT CODE 030 - 80 Marks):
   - Part A: Statistics for Economics (40 Marks)
   - Part B: Introductory Microeconomics (40 Marks)`,
    isActive: true,
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'src_c11_arts_stepwise_marking_scheme',
    title: 'CBSE Class 11 Arts / Humanities: Official Step-Wise Marking Rubric & Subjective Evaluation Rules',
    category: 'Marking Scheme',
    journey: 'CLASS_11_ARTS',
    level: 'Class 11 CBSE (Humanities)',
    subject: 'All Subjects',
    chapter: 'Step-Wise Marking & Evaluation Guidelines',
    description: 'CBSE official answer checking protocols for Class 11 Arts: Point-wise presentation, historiographical analysis, constitutional article citations, geographic terminology, and sociological concepts.',
    content: `CBSE CLASS 11 ARTS (HUMANITIES) - OFFICIAL STEP-WISE MARKING PROTOCOLS & EVALUATION STANDARDS

1. HISTORY EVALUATION RULES:
   - Chronological Accuracy & Evidence: Key dates, dynasties, sources (e.g., Cuneiform clay tablets, Roman legal codes, Secret History of the Mongols) must be cited.
   - Cause and Effect Structuring: For 8-mark essay questions, structured subheadings (e.g., Social, Economic, Political causes of Roman crisis or Meiji modernisation) are awarded 1-2 marks per well-developed point.
   - Map Work: Pinpointing geographical locations on world/regional maps (Mesopotamia, Roman Empire, Mongol trade routes) must be within 1 cm radius tolerance.

2. POLITICAL SCIENCE EVALUATION RULES:
   - Constitutional Articles & Case Laws: Citing relevant Articles (e.g., Article 14, 19, 21, 32, 356, 368) and landmark doctrines (Basic Structure Doctrine, Kesavananda Bharati) earns top band marks.
   - Conceptual Distinctions: Distinguishing concepts (FPTP vs PR system, Negative vs Positive Liberty, Procedural vs Substantive Justice) with tabular or side-by-side contrast earns full step marks.
   - Source-Based Questions: Answering with direct quotation of given passage context + contextual analytical expansion.

3. GEOGRAPHY EVALUATION RULES:
   - Diagrammatic Representation: Labeled diagrams (e.g., Earth's interior layers, Plate boundaries, Fluvial landforms/oxbow lakes, Atmospheric circulation cells, Monsoon mechanism) carry 1 mark out of 3/5 mark questions.
   - Technical Terminology: Using precise geomorphic terms (e.g., Insolation, Corrasion, Coriolis Force, Thermocline, Biome) rather than generic descriptive wording.

4. SOCIOLOGY & PSYCHOLOGY EVALUATION RULES:
   - Thinker / Theorist Attribution: Mentioning relevant thinkers (Durkheim, Weber, Marx, Ghurye, Srinivas in Sociology; Piaget, Pavlov, Skinner, Maslow, Atkinson-Shiffrin in Psychology).
   - Real-World Case Application: Providing an empirical example for concepts like socialization, stratification, cognitive bias, or conditioning.

5. ECONOMICS EVALUATION RULES:
   - Formulas & Computation in Statistics: Step 1 (Formula), Step 2 (Table computation), Step 3 (Calculation), Step 4 (Interpretation).
   - Microeconomics Graphs: Labeled axes (Price on Y-axis, Quantity on X-axis), curves with direction of shifts (e.g., demand/supply shift, PPC shift, IC tangents) carry 1.5 - 2 marks in 4/6 mark questions.`,
    isActive: true,
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'src_c11_comm_cbse_master_syllabus',
    title: 'CBSE Class 11 Commerce: Official 2025-26 Rationalized Syllabus & Accounting Standards Blueprint',
    category: 'Official Syllabus',
    journey: 'CLASS_11_COMMERCE',
    level: 'Class 11 CBSE (Commerce)',
    subject: 'All Subjects',
    chapter: 'Official Curriculum Blueprint & Deleted Topics',
    description: 'Complete official CBSE rationalized syllabus for Class 11 Accountancy (055), Business Studies (054), Economics (030), Applied Mathematics (241), and Entrepreneurship (066). Contains accounting conventions and format rules.',
    content: `CBSE CLASS 11 COMMERCE - OFFICIAL 2025-2026 RATIONALIZED SYLLABUS & BLUEPRINT

1. ACCOUNTANCY (SUBJECT CODE 055 - 80 Marks):
   - Part A: Financial Accounting - I (56 Marks):
     * Unit 1: Theoretical Framework (Introduction to Accounting, Qualitative Characteristics, Basic Terms, GAAP Concepts & Principles, Cash vs Accrual Basis, Accounting Standards & Ind AS).
     * Unit 2: Accounting Process (Recording of Transactions, Vouchers, Accounting Equation, Rules of Debit/Credit, Journal, Ledger, Cash Book & Subsidiary Books, Bank Reconciliation Statement BRS with Amended Cash Book, Depreciation - SLM vs WDV & Asset Disposal, Provisions & Reserves, Trial Balance & Rectification of Errors).
   - Part B: Financial Accounting - II (24 Marks):
     * Unit 3: Financial Statements of Sole Proprietorship (Trading & Profit and Loss Account, Balance Sheet, Adjustments: Closing Stock, Outstanding/Prepaid, Accrued/Advance, Depreciation, Bad Debts & Provision for Doubtful Debts).
     * Unit 4: Incomplete Records (Single Entry System: Ascertainment of Profit/Loss by Statement of Affairs Method).
   - ❌ CRITICAL DELETED TOPICS:
     * Bills of Exchange (Promissory Notes, Discounting, Endorsement, Dishonour, Retirement of Bills) - COMPLETELY DELETED FROM SYLLABUS!
     * Use of Computers in Accounting (Computerised Accounting System CAS) - Separate optional module has zero main theory paper weightage.

2. BUSINESS STUDIES (SUBJECT CODE 054 - 80 Marks):
   - Part A: Foundations of Business (40 Marks):
     * Chapter 1: Evolution and Fundamentals of Business
     * Chapter 2: Forms of Business Organisations (Sole Proprietorship, HUF, Partnership, Cooperative Societies, Joint Stock Company, OPC)
     * Chapter 3: Public, Private and Global Enterprises (Departmental Undertakings, Statutory Corporations, Government Companies, MNCs, Joint Ventures & PPP)
     * Chapter 4: Business Services (Banking, Insurance: Life/Fire/Marine Principles, Postal/Warehousing)
     * Chapter 5: Emerging Modes of Business (e-Business, BPO)
     * Chapter 6: Social Responsibility of Business and Business Ethics
   - Part B: Finance and Trade (40 Marks):
     * Chapter 7: Sources of Business Finance (Owner vs Borrowed, Shares, Debentures, Retained Earnings, Commercial Paper, Trade Credit, ADR/GDR)
     * Chapter 8: Small Business and Enterprises (MSME, Entrepreneurship, Startup India, IPR)
     * Chapter 9: Internal Trade (Wholesale, Retail, Departmental & Chain Stores, GST)
     * Chapter 10: International Business (Export/Import Procedures, Key Documents, WTO)

3. ECONOMICS (SUBJECT CODE 030 - 80 Marks):
   - Part A: Statistics for Economics (40 Marks)
   - Part B: Introductory Microeconomics (40 Marks)

4. APPLIED MATHEMATICS (SUBJECT CODE 241 - 80 Marks):
   - Numbers & Modulo Arithmetic, Algebra & Sets, Mathematical Reasoning, Calculus, Probability, Descriptive Statistics, Financial Mathematics (Annuity, EMI, Sinking Fund), Coordinate Geometry.`,
    isActive: true,
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'src_c11_comm_stepwise_marking_scheme',
    title: 'CBSE Class 11 Commerce: Official Step-Wise Marking Rubric & Journal / Ledger Format Rules',
    category: 'Marking Scheme',
    journey: 'CLASS_11_COMMERCE',
    level: 'Class 11 CBSE (Commerce)',
    subject: 'All Subjects',
    chapter: 'Step-Wise Marking & Numerical Evaluation Guidelines',
    description: 'CBSE official answer checking protocols for Class 11 Commerce: Journal narrations, ledger rulings, balance sheet groupings, case study quoting, and microeconomics diagrams.',
    content: `CBSE CLASS 11 COMMERCE - OFFICIAL STEP-WISE MARKING PROTOCOLS & EVALUATION STANDARDS

1. ACCOUNTANCY EVALUATION RULES:
   - Journal Entries:
     * Proper Columns: Date, Particulars, L.F., Debit (₹), Credit (₹). Missing columns penalised by 0.5 marks.
     * Narration is MANDATORY for each entry. Absence of narration leads to a 25% deduction on entry marks.
     * Working Notes: Clear calculation of Trade Discount, Cash Discount, Depreciation (Pro-rata days/months), Provision for Doubtful Debts must be shown under "Working Notes" with reference marks.
   - Ledger & Trial Balance:
     * Balancing figures must clearly indicate "To Balance c/d" / "By Balance c/d".
     * Suspense Account entries must specify which account was over/undercast.
   - Financial Statements:
     * Proper headings: "Trading and Profit & Loss Account for the year ended 31st March 20XX" and "Balance Sheet as on 31st March 20XX".
     * Marshalling of Assets/Liabilities (in order of Liquidity or Permanence).

2. BUSINESS STUDIES EVALUATION RULES:
   - Case Studies (3, 4 & 6 Marks):
     * Step 1: Identification of Concept / Form of Organisation / Source of Finance (1 Mark).
     * Step 2: Direct quotation of relevant lines from the case study (1 Mark).
     * Step 3: Explanation / Features / Merits / Demerits with point headings (1-4 Marks).
   - Point-Wise Presentation: Always use bold underline headings followed by concise 2-line explanations. Avoid writing running paragraphs without headings.

3. ECONOMICS EVALUATION RULES:
   - Numerical Problems in Statistics: Step-wise marks allocated for Formula (1m), Table Tabulation (2m), Calculation (1m), and Final Interpretation (1m).
   - Microeconomics Curves: Axes must be clearly labeled (Price on Y-axis, Quantity on X-axis). Curve intersections (Equilibrium Point E) and directional arrows for shifts carry mandatory marks.

4. APPLIED MATHEMATICS EVALUATION RULES:
   - Financial Math Formulas: Formula substitution must precede calculation. Units (₹ or %) must be written in final answer.`,
    isActive: true,
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'src_c11_sci_cbse_master_syllabus',
    title: 'CBSE Class 11 Science: Official 2025-26 Rationalized Syllabus & NCERT Blueprint',
    category: 'Official Syllabus',
    journey: 'CLASS_11_SCIENCE',
    level: 'Class 11 CBSE (Science)',
    subject: 'All Subjects',
    chapter: 'Official Curriculum Blueprint & Rationalized Topics',
    description: 'Complete official CBSE rationalized syllabus for Class 11 Physics (042), Chemistry (043), Mathematics (041), Biology (044), and Computer Science (083). Includes exact weightage and deleted portions.',
    content: `CBSE CLASS 11 SCIENCE - OFFICIAL 2025-2026 RATIONALIZED SYLLABUS & BLUEPRINT

1. PHYSICS (SUBJECT CODE 042 - 70 Theory + 30 Practical):
   - Unit I: Physical World & Measurement (Chapter 1: Units and Measurements) - 23 Marks combined with Kinematics & Laws of Motion.
   - Unit II: Kinematics (Chapter 2: Motion in a Straight Line, Chapter 3: Motion in a Plane).
   - Unit III: Laws of Motion (Chapter 4: Laws of Motion).
   - Unit IV: Work, Energy and Power (Chapter 5: Work, Energy & Power) - 17 Marks combined with Rotational Motion & Gravitation.
   - Unit V: Motion of System of Particles and Rigid Body (Chapter 6: System of Particles and Rotational Motion).
   - Unit VI: Gravitation (Chapter 7: Gravitation).
   - Unit VII: Properties of Bulk Matter (Chapter 8: Mechanical Properties of Solids, Chapter 9: Mechanical Properties of Fluids, Chapter 10: Thermal Properties of Matter) - 20 Marks combined with Thermodynamics & Kinetic Theory.
   - Unit VIII: Thermodynamics (Chapter 11: Thermodynamics).
   - Unit IX: Behaviour of Perfect Gases and Kinetic Theory (Chapter 12: Kinetic Theory).
   - Unit X: Oscillations and Waves (Chapter 13: Oscillations, Chapter 14: Waves) - 10 Marks.
   - ❌ CRITICAL DELETED TOPICS IN PHYSICS:
     * Physical World chapter deleted as a separate testing unit.
     * Rolling motion without slipping detailed torque proof deleted.
     * Heat engines and refrigerators completely deleted.
     * Doppler effect in sound waves completely deleted.

2. CHEMISTRY (SUBJECT CODE 043 - 70 Theory + 30 Practical):
   - Unit 1: Some Basic Concepts of Chemistry (7 Marks)
   - Unit 2: Structure of Atom (9 Marks)
   - Unit 3: Classification of Elements and Periodicity in Properties (6 Marks)
   - Unit 4: Chemical Bonding and Molecular Structure (7 Marks)
   - Unit 5: Chemical Thermodynamics (9 Marks)
   - Unit 6: Equilibrium (7 Marks)
   - Unit 7: Redox Reactions (4 Marks)
   - Unit 8: Organic Chemistry: Some Basic Principles and Techniques (11 Marks)
   - Unit 9: Hydrocarbons (10 Marks)
   - ❌ DELETED CHAPTERS IN CHEMISTRY:
     * States of Matter (Gaseous & Liquid States) - DELETED.
     * Hydrogen - DELETED.
     * s-Block Elements (Alkali & Alkaline Earth Metals) - DELETED.
     * Environmental Chemistry - DELETED.

3. MATHEMATICS (SUBJECT CODE 041 - 80 Theory + 20 Internal):
   - Sets and Functions (Sets, Relations & Functions, Trigonometric Functions - 23 Marks).
   - Algebra (Complex Numbers, Linear Inequalities, Permutations & Combinations, Binomial Theorem, Sequences & Series - 25 Marks).
   - Coordinate Geometry (Straight Lines, Conic Sections, Introduction to 3D Geometry - 12 Marks).
   - Calculus (Limits and Derivatives - 08 Marks).
   - Statistics and Probability (Statistics, Probability - 12 Marks).
   - ❌ DELETED TOPICS IN MATHS:
     * Principle of Mathematical Induction (PMI) - COMPLETELY DELETED.
     * Mathematical Reasoning - COMPLETELY DELETED.
     * General and middle terms in Binomial Theorem (rationalized).

4. BIOLOGY (SUBJECT CODE 044 - 70 Theory + 30 Practical):
   - Diversity of Living Organisms (15 Marks)
   - Structural Organisation in Plants & Animals (10 Marks)
   - Cell: Structure and Function (15 Marks)
   - Plant Physiology (12 Marks)
   - Human Physiology (18 Marks)
   - ❌ DELETED CHAPTERS: Transport in Plants, Mineral Nutrition, and Digestion and Absorption have been removed from the rationalized syllabus.`,
    isActive: true,
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'src_c11_sci_stepwise_marking_scheme',
    title: 'CBSE Class 11 Science: Official Step-Wise Marking Rubric & Derivation / Diagram Protocols',
    category: 'Marking Scheme',
    journey: 'CLASS_11_SCIENCE',
    level: 'Class 11 CBSE (Science)',
    subject: 'All Subjects',
    chapter: 'Step-Wise Marking & Evaluation Standards',
    description: 'CBSE official answer checking protocols for Class 11 Science: Physics numericals & derivations, Chemistry IUPAC nomenclature & reaction mechanisms, Maths theorem proofs, and Biology anatomical diagrams.',
    content: `CBSE CLASS 11 SCIENCE - OFFICIAL STEP-WISE MARKING PROTOCOLS & EVALUATION STANDARDS

1. PHYSICS EVALUATION RULES:
   - Numerical Problems (2, 3 & 5 Marks):
     * Step 1: Given data with SI units and identification of target variable (0.5 Mark).
     * Step 2: Formula writing in standard symbol notation (0.5 to 1 Mark).
     * Step 3: Step-by-step substitution and algebraic simplification (1 to 2 Marks).
     * Step 4: Final answer with correct numerical value, appropriate significant figures, and MANDATORY SI UNIT (0.5 Mark deduction for missing or wrong unit!).
   - Derivations (3 & 5 Marks):
     * Clear labeled vector/schematic diagram with descriptive introductory statement.
     * Mathematical progression from first principles with reason statements for approximations.
     * Final boxed formula with physical significance.

2. CHEMISTRY EVALUATION RULES:
   - Chemical Reactions & Equations:
     * All chemical equations must be balanced with appropriate reaction conditions (catalyst, temperature, pressure) above the arrow.
     * Organic Mechanisms: Curved arrows showing electron pair movement, intermediate carbocation / transition state must be clearly depicted.
     * IUPAC Nomenclature: Strict adherence to IUPAC 2013 recommendations (locants, hyphens, commas). Minor spelling typos in suffixes (e.g. -ol vs -al) penalized by 0.5 marks.
   - Physical Chemistry Numericals: Step marks for formula, log/antilog table substitution, and units (kJ/mol, mol/L, atm).

3. MATHEMATICS EVALUATION RULES:
   - Proofs & Geometric Constructions:
     * "Given", "To Prove", "Construction" (if any), and "Proof" structured layout.
     * Every logical deduction step must cite the axiom, theorem, or trigonometric identity used.
   - Limits & Derivatives: First principle derivations must evaluate delta limits explicitly with h -> 0 notation written on every step until substitution.

4. BIOLOGY EVALUATION RULES:
   - Anatomical & Cytological Diagrams:
     * Neat pencil diagrams with right-hand aligned horizontal label lines.
     * Minimum 4 key anatomical structures must be correctly labeled for a 2-mark diagram; 6-8 labels for a 3/5-mark diagram.
   - Physiology Descriptions: Sequential biological pathway steps (e.g. Calvin cycle, Glycolysis, Cardiac cycle) must maintain strict chronological sequence.`,
    isActive: true,
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

import { AcademicJourney } from '../types';

export interface SampleExam {
  id: string;
  title: string;
  journey: AcademicJourney;
  level: string;
  subject: string;
  chapter?: string;
  difficulty: string;
  totalMarks: number;
  description: string;
  documentContent: string;
}

export const SAMPLE_EXAMS: SampleExam[] = [
  {
    id: 'sample_c12_accountancy',
    title: 'Class 12 Accountancy: Partnership Fundamentals & P&L Appropriation',
    journey: 'CLASS_12',
    level: 'Class 12 CBSE',
    subject: 'Accountancy',
    chapter: 'Fundamentals of Partnership',
    difficulty: 'CBSE Board Standard',
    totalMarks: 25,
    description: 'Realistic Class 12 exam on P&L Appropriation, Interest on Drawings average period method, and Past Adjustments.',
    documentContent: `=== QUESTION PAPER: CLASS 12 ACCOUNTANCY (TIME: 1 HOUR | MAX MARKS: 25) ===
SECTION A: CONCEPTUAL & SHORT NUMERICAL (10 MARKS)
Q1. State the provisions of the Indian Partnership Act, 1932 regarding:
    (a) Interest on Capital, (b) Interest on Drawings, (c) Partner's Salary, (d) Interest on Partner's Loan, in the absence of a Partnership Deed. [4 Marks]
Q2. A and B are partners sharing profits in the ratio 3:2. A withdrew ₹4,000 at the beginning of every month for 12 months. Calculate Interest on Drawings @ 10% p.a. using the Average Period method. [6 Marks]

SECTION B: COMPREHENSIVE NUMERICAL (15 MARKS)
Q3. X and Y entered into partnership on 1st April 2025 with capitals of ₹5,00,000 and ₹3,00,000. As per partnership deed:
    - Interest on capital is allowed @ 6% p.a.
    - X is entitled to a salary of ₹5,000 per month.
    - Y is entitled to a commission of 5% on net profit after charging such commission.
    - Profit sharing ratio is 3:2.
    Net profit for the year ended 31st March 2026 before any adjustments was ₹2,10,000.
    Prepare Profit and Loss Appropriation Account for the year ended 31st March 2026. [8 Marks]
Q4. Explain what is meant by 'Past Adjustments' in partnership accounts and state two reasons why past errors occur. [7 Marks]

============================================================
=== STUDENT ANSWER SHEET: ROLL NO: C12-COMM-2026-44 ===
============================================================

Answer 1:
In the absence of a Partnership Deed, provisions are:
(a) Interest on Capital: No interest is allowed to any partner.
(b) Interest on Drawings: No interest is charged on drawings.
(c) Partner's Salary: No salary or remuneration is payable to any partner.
(d) Interest on Partner's Loan: Allowed @ 6% p.a. (Charge against profit).

Answer 2:
Given:
Monthly drawings = ₹4,000
Total drawings in year = 4,000 × 12 = ₹48,000
Rate of interest = 10% p.a.
Average period for drawings at the beginning of each month:
Average Period = (Months left after 1st drawing + Months left after last drawing) / 2
= (12 + 1) / 2 = 13 / 2 = 6.5 months.

Interest on Drawings = Total Drawings × (Rate / 100) × (Average Period / 12)
= ₹48,000 × (10 / 100) × (6.5 / 12)
= 4,800 × (6.5 / 12)
= 400 × 6.5 = ₹2,600.

Answer 3:
PROFIT AND LOSS APPROPRIATION ACCOUNT
For the year ended 31st March, 2026

Dr.                                                                        Cr.
Particulars                      Amount (₹)   Particulars           Amount (₹)
To Interest on Capital:                       By Net Profit b/d       2,10,000
  X (5,00,000 × 6%) = 30,000
  Y (3,00,000 × 6%) = 18,000        48,000
To X's Salary (5,000 × 12)          60,000
To Y's Commission:
  (Net profit ₹2,10,000 × 5 / 105)  10,000
To Profit Transferred to:
  X's Capital A/c (3/5) = 55,200
  Y's Capital A/c (2/5) = 36,800    92,000
--------------------------------------------------------------------------
Total                             2,10,000    Total                   2,10,000
--------------------------------------------------------------------------

Working Note:
Divisible Profit = 2,10,000 - (48,000 + 60,000 + 10,000) = 2,10,000 - 1,18,000 = ₹92,000.
X's share = 92,000 × 3/5 = ₹55,200.
Y's share = 92,000 × 2/5 = ₹36,800.

Answer 4:
Past adjustments refer to adjustments made in the books of accounts of a partnership firm to rectify errors or omissions that took place in previous years after the final accounts have been closed.
Reasons for past errors:
1. Interest on capital was omitted or provided at wrong rate.
(Student forgot to write the second reason like omission of interest on drawings or profit sharing ratio changed retrospectively).
`
  },
  {
    id: 'sample_c12_acc_revaluation_realisation',
    title: 'Class 12 Accountancy: Revaluation, Realisation & Partner Capital Accounts',
    journey: 'CLASS_12',
    level: 'Class 12 CBSE',
    subject: 'Accountancy',
    chapter: 'Admission of a Partner',
    difficulty: 'CBSE Board Standard',
    totalMarks: 24,
    description: 'Comprehensive 8-mark numericals on Revaluation A/c, Partners Capital A/c on Admission, and Realisation A/c on Dissolution of firm.',
    documentContent: `=== QUESTION PAPER: CLASS 12 ACCOUNTANCY (TIME: 1 HOUR | MAX MARKS: 24) ===
SECTION A: ADMISSION OF A PARTNER & REVALUATION ACCOUNT (12 MARKS)
Q1. A and B are partners sharing profits in the ratio of 3:2. Their Balance Sheet as at 31st March 2026 showed:
    Liabilities: Sundry Creditors ₹60,000; General Reserve ₹40,000; Capitals: A ₹1,50,000, B ₹1,00,000 (Total ₹3,50,000).
    Assets: Cash at Bank ₹40,000; Debtors ₹80,000 (Less Provision for Doubtful Debts ₹4,000) = ₹76,000; Stock ₹94,000; Machinery ₹1,40,000 (Total ₹3,50,000).
    On 1st April 2026, they admit C into partnership on the following terms:
    (a) C brings in ₹1,00,000 as capital and ₹30,000 for his 1/4th share of goodwill premium.
    (b) Provision for Doubtful Debts is to be maintained at 10% on Debtors.
    (c) Stock is undervalued by ₹6,000 and Machinery is to be depreciated by 10%.
    (d) An unrecorded creditor of ₹2,000 is to be brought into books.
    Prepare: (i) Revaluation Account, (ii) Partners' Capital Accounts. [12 Marks]

SECTION B: DISSOLUTION OF PARTNERSHIP FIRM & REALISATION ACCOUNT (12 MARKS)
Q2. X and Y were partners sharing profits equally. They decided to dissolve their partnership firm on 31st March 2026.
    On that date, Book Values of Assets were: Sundry Debtors ₹50,000 (Provision ₹2,000), Stock ₹45,000, Furniture ₹30,000, Plant & Machinery ₹1,20,000.
    Liabilities were: Sundry Creditors ₹40,000, Mrs. X's Loan ₹20,000, X's Loan to Firm ₹15,000.
    Realisation details:
    (a) Debtors realised ₹44,000.
    (b) X took over Stock at 10% discount.
    (c) Furniture was sold for ₹24,000 and Plant & Machinery realised 80% of book value.
    (d) Creditors were paid off at a discount of 5%.
    (e) Mrs. X's loan was paid in full.
    (f) Realisation expenses amounted to ₹3,000 which were paid by the firm.
    Prepare Realisation Account. [12 Marks]

============================================================
=== STUDENT ANSWER SHEET: ROLL NO: C12-ACC-TOPPER-89 ===
============================================================

Answer 1:
(i) REVALUATION ACCOUNT
Dr.                                                                        Cr.
Particulars                      Amount (₹)   Particulars           Amount (₹)
To Provision for Doubtful Debts                By Stock A/c (Undervalued)  6,000
   [(80,000 × 10%) - 4,000]       4,000
To Machinery (1,40,000 × 10%)    14,000        By Loss on Revaluation:
To Unrecorded Creditor            2,000          A's Capital A/c (3/5)     8,400
                                                 B's Capital A/c (2/5)     5,600  14,000
--------------------------------------------------------------------------
Total                            20,000        Total                      20,000
--------------------------------------------------------------------------

(ii) PARTNERS' CAPITAL ACCOUNTS
Dr.                                                                                                Cr.
Particulars            A (₹)      B (₹)      C (₹)    Particulars            A (₹)      B (₹)      C (₹)
To Revaluation Loss    8,400      5,600        -      By Balance b/d      1,50,000   1,00,000        -
To Balance c/d      1,83,600   1,22,400   1,00,000    By Bank A/c                -          -   1,00,000
                                                      By Premium for GW     18,000     12,000        -
                                                         (30,000 in 3:2)
                                                      By General Reserve    24,000     16,000        -
                                                         (40,000 in 3:2)
--------------------------------------------------------------------------------------------------------
Total               1,92,000   1,28,000   1,00,000    Total               1,92,000   1,28,000   1,00,000
--------------------------------------------------------------------------------------------------------

Answer 2:
REALISATION ACCOUNT
Dr.                                                                        Cr.
Particulars                      Amount (₹)   Particulars           Amount (₹)
To Sundry Debtors                50,000       By Provision for D/D         2,000
To Stock                         45,000       By Sundry Creditors         40,000
To Furniture                     30,000       By Mrs. X's Loan            20,000
To Plant & Machinery           1,20,000       By Bank A/c (Assets Realised):
To Bank A/c (Creditors Paid):                    Debtors: ₹44,000
   (40,000 - 5% = 38,000)        38,000          Furniture: ₹24,000
To Bank A/c (Mrs. X's Loan)      20,000          Plant (80%): ₹96,000   1,64,000
To Bank A/c (Realisation Exp)     3,000       By X's Capital A/c (Stock):
                                                 (45,000 - 10%)           40,500
                                              By Loss on Realisation:
                                                 X's Capital (1/2): 19,750
                                                 Y's Capital (1/2): 19,750  39,500
--------------------------------------------------------------------------
Total                          3,06,000       Total                     3,06,000
--------------------------------------------------------------------------
Note: X's Loan to firm (₹15,000) is not transferred to Realisation Account as per Section 48 of Partnership Act. It is settled through X's Loan A/c.
`
  },
  {
    id: 'sample_c12_bst',
    title: 'Class 12 Business Studies: Principles of Management & Case Study',
    journey: 'CLASS_12',
    level: 'Class 12 CBSE',
    subject: 'Business Studies',
    chapter: 'Principles of Management',
    difficulty: 'CBSE Board Standard',
    totalMarks: 20,
    description: 'Case studies identifying Fayol principles and Taylor scientific management techniques with lines quoted.',
    documentContent: `=== QUESTION PAPER: CLASS 12 BUSINESS STUDIES (MAX MARKS: 20) ===
Q1. Explain the principle of 'Unity of Command' and 'Unity of Direction' formulated by Henri Fayol. Differentiate between them on the basis of: (a) Meaning, (b) Aim, (c) Implications. [6 Marks]
Q2. What is 'Functional Foremanship' technique developed by F.W. Taylor? List the four foremen under Planning Department and four foremen under Execution/Production Department. [8 Marks]
Q3. Case Study: 'Apex Auto Ltd.' is an automobile manufacturing company. The CEO, Mr. Vikram, observed that workers were taking frequent unscheduled tea breaks and were exhausting themselves by bending repeatedly to lift steel plates from the ground. He hired an industrial engineer who rearranged the workstation height so workers do not bend, and fixed structured rest intervals.
Identify and explain the two Scientific Management techniques introduced by Mr. Vikram by quoting lines from the passage. [6 Marks]

============================================================
=== STUDENT ANSWER SHEET: ROLL NO: C12-BST-98 ===
============================================================

Ans 1:
Unity of Command: A subordinate should receive orders from and be accountable to only one superior at a time. If there are multiple bosses, it leads to confusion and conflict.
Unity of Direction: Each group of activities having the same objective must have one head and one plan.

Differences:
(a) Meaning: Unity of command means one subordinate, one boss. Unity of direction means one head, one plan for a group of activities.
(b) Aim: Unity of command aims to prevent dual subordination and confusion. Unity of direction aims to prevent overlapping of activities.
(c) Implications: Unity of command affects an individual employee. Unity of direction affects the entire organization.

Ans 2:
Functional Foremanship is a scientific management technique introduced by F.W. Taylor where planning is separated from execution. Taylor suggested 8 specialized foremen:
Under Planning Incharge:
1. Instruction Card Clerk (drafts instructions for workers)
2. Route Clerk (specifies the sequence of operations)
3. Time and Cost Clerk (prepares time schedule and cost sheet)
4. Disciplinarian (ensures discipline and systematic work)

Under Production Incharge:
1. Speed Boss (ensures timely completion of work)
2. Gang Boss (keeps machines, tools, and materials ready)
3. Repair Boss (ensures proper maintenance of machines)
4. Inspector (checks the quality of output)

Ans 3:
The two Scientific Management techniques introduced are:
1. Motion Study:
Quoted line: "...rearranged the workstation height so workers do not bend..."
Explanation: Motion study aims to eliminate unnecessary, unproductive movements of workers so that productive efficiency increases.

2. Fatigue Study:
Quoted line: "...workers were taking frequent unscheduled tea breaks and were exhausting themselves... fixed structured rest intervals."
Explanation: Fatigue study determines the frequency and duration of rest intervals required by workers to regain their stamina and work with optimal efficiency.
`
  },
  {
    id: 'sample_ca_law',
    title: 'CA Foundation Business Laws: Indian Contract Act 1872 Case Study',
    journey: 'CA_FOUNDATION',
    level: 'CA Foundation ICAI',
    subject: 'Business Laws',
    chapter: 'Indian Contract Act, 1872: Nature of Contracts & Offer/Acceptance',
    difficulty: 'ICAI Exam Standard',
    totalMarks: 20,
    description: 'ICAI 4-tier structured case analysis on Intention to Create Legal Relations (Balfour v. Balfour) and Coercion.',
    documentContent: `=== QUESTION PAPER: CA FOUNDATION BUSINESS LAWS (MAX MARKS: 20) ===
Q1. Mr. Ramesh promised to pay a monthly allowance of ₹25,000 to his wife Sunita while he was posted abroad on an official project. Ramesh paid the allowance for two months and thereafter stopped sending money due to marital disputes. Sunita filed a lawsuit against Ramesh for recovery of the arrears.
Decide with reference to the provisions of the Indian Contract Act, 1872, whether Sunita can successfully recover the amount from Ramesh. Refer to relevant case law. [6 Marks]

Q2. Define 'Coercion' under Section 15 of the Indian Contract Act, 1872. Differentiate between Coercion and Undue Influence with respect to:
(a) Nature of pressure, (b) Parties involved, (c) Criminal liability, (d) Restoration of benefit. [7 Marks]

Q3. "An agreement without consideration is void." State the statutory exceptions to this rule as per Section 25 of the Indian Contract Act, 1872. [7 Marks]

============================================================
=== STUDENT ANSWER SHEET: CA-FND-ROLL-701 ===
============================================================

Ans 1:
1. Provision of Law:
According to the Indian Contract Act, 1872, to constitute a valid contract, there must be an intention to create legal relations between the parties. In social, domestic, and family agreements, the presumption is that the parties do not intend to create legal obligations unless specifically intended.
Reference Case Law: Balfour v. Balfour (1919).

2. Facts of the Case:
Mr. Ramesh promised to send a monthly maintenance allowance of ₹25,000 to his wife Sunita while abroad. Later, due to interpersonal disputes, he stopped sending the money, and Sunita filed a suit.

3. Analysis:
The agreement between Ramesh and his wife Sunita is a purely domestic/social agreement. There was no express or implied intention between husband and wife to establish a legally enforceable contract.

4. Conclusion:
Sunita cannot succeed in her suit against Ramesh because there is no enforceable contract in the eyes of law.

Ans 2:
Coercion (Section 15):
Coercion is the committing, or threatening to commit, any act forbidden by the Indian Penal Code (IPC), or the unlawful detaining, or threatening to detain, any property, to the prejudice of any person whatever, with the intention of causing any person to enter into an agreement.

Distinction between Coercion and Undue Influence:
(a) Nature of pressure: Coercion involves physical force or threat of IPC offences. Undue Influence involves mental/moral pressure due to dominant position.
(b) Parties involved: Coercion can be exercised by or against a third party/stranger. Undue Influence must exist between parties where one is in a position to dominate the will of another.
(c) Criminal liability: Coercion attracts criminal liability under IPC. Undue Influence does not attract criminal liability.
(d) Restoration of benefit: Under Section 64, benefits received under coercion must be restored. Under Section 19A, court may direct restoration of benefit as it deems just.

Ans 3:
Exceptions under Section 25 where agreement without consideration is valid:
1. Natural Love and Affection [Sec 25(1)]: Agreement made out of natural love and affection between parties standing in near relation, expressed in writing and registered under law.
2. Compensation for Past Voluntary Services [Sec 25(2)]: Promise to compensate a person who has already voluntarily done something for the promisor.
3. Promise to Pay a Time-Barred Debt [Sec 25(3)]: A promise in writing signed by debtor to pay a debt barred by the law of limitation.
4. Completed Gifts: Explanation 1 to Section 25.
5. Agency contracts (Section 185) and Remission of performance (Section 63).
`
  },
  {
    id: 'sample_ca_accounting',
    title: 'CA Foundation Accounting: Dissolution of Firm & Garner vs Murray Rule (Paper 1)',
    journey: 'CA_FOUNDATION',
    level: 'CA Foundation ICAI',
    subject: 'Principles and Practice of Accounting',
    chapter: 'Dissolution of Partnership Firm & Insolvency of Partners (Garner vs Murray)',
    difficulty: 'ICAI Exam Standard',
    totalMarks: 20,
    description: 'Insolvency of partner, Garner vs Murray ruling applicability, cash contribution for realization loss, and final settlement.',
    documentContent: `=== QUESTION PAPER: CA FOUNDATION ACCOUNTING (PAPER 1 | MAX MARKS: 20) ===
Q1. P, Q, and R were partners sharing profits and losses in the ratio of 4:2:1. On 31st March 2026, the firm was dissolved. Their Balance Sheet stood as follows:
Liabilities:
- Capitals: P ₹80,000, Q ₹40,000
- Sundry Creditors: ₹30,000
Total Liabilities: ₹1,50,000

Assets:
- Sundry Assets: ₹1,10,000
- Cash at Bank: ₹10,000
- R's Capital (Debit balance / Overdrawn): ₹30,000
Total Assets: ₹1,50,000

Additional Information:
1. Sundry Assets realized ₹82,000. Creditors were paid in full.
2. Realization expenses amounted to ₹2,000.
3. Partner R became insolvent and only ₹6,000 could be recovered from his private estate.
4. Apply the decision in Garner vs. Murray.

Required:
(a) Prepare Realization Account. [6 Marks]
(b) Prepare Bank Account. [4 Marks]
(c) Prepare Partners' Capital Accounts showing the final settlement and the allocation of deficiency under Garner vs. Murray. [10 Marks]

============================================================
=== STUDENT ANSWER SHEET: ROLL NO: CA-FOUND-2026-091 ===
============================================================

Ans 1:
WORKING NOTES:

1. Loss on Realization:
Book value of Sundry Assets = ₹1,10,000
Realized value = ₹82,000
Loss on Assets = ₹28,000
Add: Realization Expenses = ₹2,000
Total Realization Loss = ₹30,000

Allocated in Profit Sharing Ratio (4:2:1):
- P's share = 30,000 × (4/7) = ₹17,143
- Q's share = 30,000 × (2/7) = ₹8,571
- R's share = 30,000 × (1/7) = ₹4,286

2. Rule in Garner vs. Murray:
Under the ruling of Garner vs. Murray:
(i) Solvent partners (P and Q) must bring in cash equal to their respective shares of Realization loss.
    - P brings in ₹17,143 cash.
    - Q brings in ₹8,571 cash.
(ii) The deficiency arising on account of an insolvent partner's capital (after crediting dividend from private estate) must be borne by the solvent partners in the ratio of their capitals standing just before dissolution (original capital ratio).
    - Original Capital of P = ₹80,000
    - Original Capital of Q = ₹40,000
    - Capital Ratio = 80,000 : 40,000 = 2 : 1.

3. R's Deficiency Calculation:
Debit balance brought forward = ₹30,000
Add: Share of Realization Loss = ₹4,286
Total Debit Balance = ₹34,286
Less: Amount recovered from private estate = ₹6,000
Net Insolvent Deficiency of R = ₹28,286

Deficiency borne by P and Q in Capital Ratio (2:1):
- P's share = 28,286 × (2/3) = ₹18,857
- Q's share = 28,286 × (1/3) = ₹9,429

--------------------------------------------------------------------------
REALIZATION ACCOUNT
--------------------------------------------------------------------------
Dr.                                                                        Cr.
Particulars                      Amount (₹)   Particulars           Amount (₹)
To Sundry Assets               1,10,000      By Bank (Assets)          82,000
To Bank (Creditors paid)         30,000      By Loss on Realization:
To Bank (Realization Exp)         2,000        P's Capital   17,143
                                               Q's Capital    8,571
                                               R's Capital    4,286    30,000
                                             By Bank (Creditors contra)30,000
--------------------------------------------------------------------------
Total                          1,42,000      Total                   1,42,000
--------------------------------------------------------------------------

--------------------------------------------------------------------------
PARTNERS' CAPITAL ACCOUNTS
--------------------------------------------------------------------------
Particulars             P (₹)       Q (₹)       R (₹)
Dr.
To Balance b/d              -           -      30,000
To Realization Loss    17,143       8,571       4,286
To R's Capital (Def.)  18,857       9,429           -
To Bank (Final Pay)    61,143      30,571           -
--------------------------------------------------------------------------
Total                  97,143      48,571      34,286
--------------------------------------------------------------------------
Cr.
By Balance b/d         80,000      40,000           -
By Bank (Realiz. Loss) 17,143       8,571           -
By Bank (Private Est.)      -           -       6,000
By P's Capital (Def.)       -           -      18,857
By Q's Capital (Def.)       -           -       9,429
--------------------------------------------------------------------------
Total                  97,143      48,571      34,286
--------------------------------------------------------------------------
`
  },
  {
    id: 'sample_c12_mathematics',
    title: 'Class 12 Core Mathematics: Matrices, Integrals, 3D Geometry & Bayes Theorem',
    journey: 'CLASS_12',
    level: 'Class 12 CBSE',
    subject: 'Mathematics',
    chapter: 'Integrals (Definite & Indefinite)',
    difficulty: 'CBSE Board Standard (Code 041)',
    totalMarks: 25,
    description: 'Authentic 25-mark CBSE Class 12 Core Maths paper covering Matrix Inversion method AX=B, Definite Integral property, Skew Lines Shortest Distance in 3D, and Bayes Theorem probability.',
    documentContent: `=== QUESTION PAPER: CBSE CLASS 12 MATHEMATICS (MAX MARKS: 25 | TIME: 1 HOUR) ===
SECTION A: MATRICES & SYSTEM OF LINEAR EQUATIONS (6 MARKS)
Q1. Solve the following system of linear equations using Matrix Method:
    x - y + 2z = 7
    3x + 4y - 5z = -5
    2x - y + 3z = 12
    [6 Marks]

SECTION B: CALCULUS & DEFINITE INTEGRALS (5 MARKS)
Q2. Evaluate the definite integral using properties:
    I = ∫_{0}^{\\pi/2} \\frac{\\sqrt{\\sin x}}{\\sqrt{\\sin x} + \\sqrt{\\cos x}} dx
    [5 Marks]

SECTION C: THREE DIMENSIONAL GEOMETRY (8 MARKS)
Q3. Find the shortest distance between the two skew lines whose vector equations are:
    \\vec{r} = (\\hat{i} + 2\\hat{j} + \\hat{k}) + \\lambda(\\hat{i} - \\hat{j} + \\hat{k})
    and
    \\vec{r} = (2\\hat{i} - \\hat{j} - \\hat{k}) + \\mu(2\\hat{i} + \\hat{j} + 2\\hat{k})
    [8 Marks]

SECTION D: PROBABILITY & BAYES' THEOREM (6 MARKS)
Q4. An insurance company insured 2000 scooter drivers, 4000 car drivers and 6000 truck drivers. The probability of an accident is 0.01, 0.03 and 0.15 respectively. One of the insured persons meets with an accident. What is the probability that he is a scooter driver? Use Bayes' Theorem.
    [6 Marks]

============================================================
=== STUDENT ANSWER SHEET: ROLL NO: C12-MATHS-2026-92 ===
============================================================

Ans 1:
The given system of linear equations can be written in matrix form AX = B:
Matrix A =
[  1  -1   2 ]
[  3   4  -5 ]
[  2  -1   3 ]

X = [x, y, z]^T and B = [7, -5, 12]^T

Step 1: Determinant |A|:
|A| = 1(12 - 5) - (-1)(9 - (-10)) + 2(-3 - 8)
    = 1(7) + 1(19) + 2(-11)
    = 7 + 19 - 22 = 26 - 22 = 4.
Since |A| = 4 ≠ 0, A^(-1) exists and the system has a unique solution given by X = A^(-1) B.

Step 2: Cofactors of elements of A:
A11 = +(12 - 5) = 7
A12 = -(9 - (-10)) = -19
A13 = +(-3 - 8) = -11
A21 = -(-3 - (-2)) = -(-1) = 1
A22 = +(3 - 4) = -1
A23 = -(-1 - (-2)) = -(1) = -1
A31 = +(5 - 8) = -3
A32 = -(-5 - 6) = 11
A33 = +(4 - (-3)) = 7

Adjoint of A, adj(A) = Transpose of Cofactor Matrix:
adj(A) =
[   7   1  -3 ]
[ -19  -1  11 ]
[ -11  -1   7 ]

A^(-1) = (1/|A|) adj(A) = (1/4) * adj(A)

Step 3: Finding X = A^(-1) B:
X = (1/4) *
[   7   1  -3 ]   [  7 ]
[ -19  -1  11 ] * [ -5 ]
[ -11  -1   7 ]   [ 12 ]

Row 1: 7(7) + 1(-5) + (-3)(12) = 49 - 5 - 36 = 8
Row 2: -19(7) + (-1)(-5) + 11(12) = -133 + 5 + 132 = 4
Row 3: -11(7) + (-1)(-5) + 7(12) = -77 + 5 + 84 = 12

Therefore:
[x]       [ 8/4 ]   [ 2 ]
[y] = (1/4)[ 4/4 ] = [ 1 ]
[z]       [ 12/4]   [ 3 ]

Hence, x = 2, y = 1, z = 3.

---

Ans 2:
Let I = ∫_{0}^{\\pi/2} \\frac{\\sqrt{\\sin x}}{\\sqrt{\\sin x} + \\sqrt{\\cos x}} dx   --- (Equation 1)

Using Property: ∫_{0}^{a} f(x) dx = ∫_{0}^{a} f(a - x) dx
Here a = \\pi/2. Replacing x with (\\pi/2 - x):

I = ∫_{0}^{\\pi/2} \\frac{\\sqrt{\\sin(\\pi/2 - x)}}{\\sqrt{\\sin(\\pi/2 - x)} + \\sqrt{\\cos(\\pi/2 - x)}} dx
Since sin(\\pi/2 - x) = cos x and cos(\\pi/2 - x) = sin x:

I = ∫_{0}^{\\pi/2} \\frac{\\sqrt{\\cos x}}{\\sqrt{\\cos x} + \\sqrt{\\sin x}} dx   --- (Equation 2)

Adding (Equation 1) and (Equation 2):
2I = ∫_{0}^{\\pi/2} \\frac{\\sqrt{\\sin x} + \\sqrt{\\cos x}}{\\sqrt{\\sin x} + \\sqrt{\\cos x}} dx
2I = ∫_{0}^{\\pi/2} 1 dx
2I = [x]_{0}^{\\pi/2}
2I = \\pi/2 - 0 = \\pi/2
I = \\pi / 4.

---

Ans 3:
Comparing given vector equations with \\vec{r} = \\vec{a}_1 + \\lambda \\vec{b}_1 and \\vec{r} = \\vec{a}_2 + \\mu \\vec{b}_2:
\\vec{a}_1 = \\hat{i} + 2\\hat{j} + \\hat{k},  \\vec{b}_1 = \\hat{i} - \\hat{j} + \\hat{k}
\\vec{a}_2 = 2\\hat{i} - \\hat{j} - \\hat{k}, \\vec{b}_2 = 2\\hat{i} + \\hat{j} + 2\\hat{k}

1. Position difference: (\\vec{a}_2 - \\vec{a}_1)
(\\vec{a}_2 - \\vec{a}_1) = (2 - 1)\\hat{i} + (-1 - 2)\\hat{j} + (-1 - 1)\\hat{k} = \\hat{i} - 3\\hat{j} - 2\\hat{k}

2. Cross Product: (\\vec{b}_1 \\times \\vec{b}_2)
| \\hat{i}   \\hat{j}   \\hat{k} |
|   1       -1         1     |
|   2        1         2     |
= \\hat{i}(-2 - 1) - \\hat{j}(2 - 2) + \\hat{k}(1 - (-2))
= -3\\hat{i} - 0\\hat{j} + 3\\hat{k} = -3\\hat{i} + 3\\hat{k}

3. Magnitude |\\vec{b}_1 \\times \\vec{b}_2|:
|\\vec{b}_1 \\times \\vec{b}_2| = \\sqrt{(-3)^2 + 0^2 + 3^2} = \\sqrt{9 + 9} = \\sqrt{18} = 3\\sqrt{2}

4. Dot Product (\\vec{a}_2 - \\vec{a}_1) · (\\vec{b}_1 \\times \\vec{b}_2):
= (1)(-3) + (-3)(0) + (-2)(3) = -3 + 0 - 6 = -9

5. Shortest Distance d:
d = | (\\vec{a}_2 - \\vec{a}_1) · (\\vec{b}_1 \\times \\vec{b}_2) | / |\\vec{b}_1 \\times \\vec{b}_2|
d = |-9| / (3\\sqrt{2}) = 9 / (3\\sqrt{2}) = 3 / \\sqrt{2} = (3\\sqrt{2}) / 2 units.

---

Ans 4:
Let events be:
E1: Person chosen is scooter driver
E2: Person chosen is car driver
E3: Person chosen is truck driver
A: Insured person meets with an accident

Total drivers = 2000 + 4000 + 6000 = 12,000 drivers.
P(E1) = 2000 / 12000 = 2/12 = 1/6
P(E2) = 4000 / 12000 = 4/12 = 1/3
P(E3) = 6000 / 12000 = 6/12 = 1/2

Given conditional probabilities of accident:
P(A|E1) = 0.01 = 1/100
P(A|E2) = 0.03 = 3/100
P(A|E3) = 0.15 = 15/100

By Bayes' Theorem, required probability P(E1|A):
P(E1|A) = [ P(E1) · P(A|E1) ] / [ P(E1)·P(A|E1) + P(E2)·P(A|E2) + P(E3)·P(A|E3) ]

Numerator = (1/6) * (1/100) = 1/600

Denominator = (1/6)*(1/100) + (1/3)*(3/100) + (1/2)*(15/100)
             = (1/600) + (6/600) + (45/600)
             = (1 + 6 + 45) / 600 = 52 / 600

P(E1|A) = (1 / 600) / (52 / 600) = 1 / 52.

Therefore, the probability that the person meeting with accident is a scooter driver is 1/52.
`
  },
  {
    id: 'sample_cainter_adv_acc',
    title: 'CA Intermediate Advanced Accounting: AS 14 Amalgamation & Capital Reduction',
    journey: 'CA_INTERMEDIATE',
    level: 'CA Intermediate ICAI',
    subject: 'Advanced Accounting',
    chapter: 'Accounting for Internal Reconstruction & Capital Reduction Scheme',
    difficulty: 'ICAI Exam Standard',
    totalMarks: 20,
    description: 'ICAI New Scheme Paper 1: Calculation of Purchase Consideration under AS 14 and Capital Reduction Scheme journal entries.',
    documentContent: `=== QUESTION PAPER: ICAI CA INTERMEDIATE (NEW SCHEME) ===
PAPER 1: ADVANCED ACCOUNTING (MAX MARKS: 20 | TIME: 45 MINS)

Q1. (10 Marks)
White Ltd. agreed to acquire the business of Black Ltd. as on 31st March, 2026. The Balance Sheet of Black Ltd. as on that date is as follows:
Liabilities:
- 1,00,000 Equity Shares of ₹10 each fully paid: ₹10,00,000
- 10% Preference Share Capital (10,000 shares of ₹100 each): ₹10,00,000
- General Reserve: ₹3,00,000
- Trade Payables: ₹4,00,000
Total Liabilities: ₹27,00,000

Assets:
- Property, Plant and Equipment (PPE): ₹18,00,000
- Inventories: ₹4,50,000
- Trade Receivables: ₹3,00,000
- Cash at Bank: ₹1,50,000
Total Assets: ₹27,00,000

Terms of Amalgamation:
(a) White Ltd. agreed to issue 3 Equity Shares of ₹10 each (market price ₹15 each) for every 2 Equity shares held in Black Ltd.
(b) White Ltd. agreed to discharge 10% Preference Shares of Black Ltd. at a 10% premium by issuing 12% Preference Shares of ₹100 each in White Ltd. at par.
(c) Liquidation expenses of ₹50,000 were borne and paid directly by White Ltd.
Required: Calculate the Purchase Consideration as per AS-14 (Accounting for Amalgamations) by Net Payment Method and indicate whether liquidation expenses form part of Purchase Consideration.

Q2. (10 Marks)
Sunrise Ltd. passed a Special Resolution for Internal Reconstruction with confirmation from National Company Law Tribunal (NCLT):
(a) Equity shares of ₹10 each to be reduced to ₹2 each fully paid. Existing shares: 2,00,000.
(b) Unsecured Creditors of ₹3,00,000 agreed to accept 50,000 Equity Shares of ₹2 each in full and final settlement of their claims.
(c) The debit balance of Profit & Loss Account (accumulated losses) was ₹12,00,000, which is to be completely written off.
(d) PPE valued in books at ₹10,00,000 is revalued at ₹7,50,000 (write down by ₹2,50,000).
(e) Any remaining balance in Capital Reduction Account to be transferred to Capital Reserve.
Pass necessary Journal Entries in the books of Sunrise Ltd. for implementing the scheme.

============================================================
=== CANDIDATE ANSWER SHEET: ROLL NO: WRO-INTER-2026-901 ===
============================================================

Answer 1:
Computation of Purchase Consideration as per AS-14 (Net Payment Method):
As per AS 14 'Accounting for Amalgamations', Purchase Consideration is the aggregate of shares and other securities issued and payment made in the form of cash or other assets by the transferee company to the shareholders (Equity and Preference) of the transferor company.

1. Payment to Equity Shareholders of Black Ltd.:
   - Ratio: 3 Equity Shares of White Ltd. for every 2 Equity Shares in Black Ltd.
   - Total Equity shares of Black Ltd. = 1,00,000 shares.
   - Number of shares to be issued = 1,00,000 * (3 / 2) = 1,50,000 shares.
   - Issue Price = ₹15 per share (Face Value ₹10 + Securities Premium ₹5).
   - Amount = 1,50,000 shares * ₹15 = ₹22,50,000.

2. Payment to Preference Shareholders of Black Ltd.:
   - Preference Capital = ₹10,00,000.
   - Discharged at 10% premium = ₹10,00,000 + 10% = ₹11,00,000.
   - Discharged by 12% Preference Shares of ₹100 each at par = 11,000 shares * ₹100 = ₹11,00,000.

Total Purchase Consideration = ₹22,50,000 + ₹11,00,000 = ₹33,50,000.

Note on Liquidation Expenses:
As per AS-14, any liquidation expenses paid by the purchasing company (White Ltd.) do NOT form part of purchase consideration. In the books of White Ltd., if amalgamation is in nature of purchase, liquidation expenses are debited to Goodwill / Capital Reserve A/c.

---

Answer 2:
In the Books of Sunrise Ltd. - Journal Entries (Capital Reduction Scheme):

1. Equity Share Capital (₹10) A/c ....... Dr. ₹20,00,000
      To Equity Share Capital (₹2) A/c              ₹4,00,000
      To Capital Reduction A/c                      ₹16,00,000
   (Being reduction of 2,00,000 equity shares of ₹10 each to ₹2 each as per approved scheme)

2. Unsecured Creditors A/c ............. Dr. ₹3,00,000
      To Equity Share Capital (₹2) A/c              ₹1,00,000
      To Capital Reduction A/c                      ₹2,00,000
   (Being settlement of creditors of ₹3,00,000 by allotment of 50,000 equity shares of ₹2 each, remaining ₹2,00,000 sacrificed and credited to Capital Reduction)

3. Capital Reduction A/c ............... Dr. ₹14,50,000
      To Profit & Loss A/c (Debit Balance)          ₹12,00,000
      To Property, Plant & Equipment (PPE) A/c      ₹2,50,000
   (Being accumulated losses and reduction in PPE value written off against Capital Reduction A/c)

4. Total credit in Capital Reduction = ₹16,00,000 + ₹2,00,000 = ₹18,00,000.
   Utilized in writing off = ₹14,50,000.
   Remaining Surplus = ₹18,00,000 - ₹14,50,000 = ₹3,50,000.

   Capital Reduction A/c ............... Dr. ₹3,50,000
      To Capital Reserve A/c                        ₹3,50,000
   (Being surplus in Capital Reduction Account transferred to Capital Reserve A/c)
`
  },
  {
    id: 'sample_cainter_taxation',
    title: 'CA Intermediate Taxation: Section 115BAC & GST ITC Blocked Credits',
    journey: 'CA_INTERMEDIATE',
    level: 'CA Intermediate ICAI',
    subject: 'Taxation',
    chapter: 'Income Tax: Basic Concepts, Tax Rates & Section 115BAC Default Regime',
    difficulty: 'ICAI Exam Standard',
    totalMarks: 20,
    description: 'ICAI New Scheme Paper 3: Section 115BAC individual tax calculation and CGST Section 17(5) blocked ITC case study.',
    documentContent: `=== QUESTION PAPER: ICAI CA INTERMEDIATE (NEW SCHEME) ===
PAPER 3: TAXATION (SECTION A: INCOME TAX & SECTION B: GST | MAX MARKS: 20)

SECTION A: INCOME TAX LAW (10 MARKS)
Q1. (10 Marks)
Mr. Rohan (age 38 years, resident) furnishes the following particulars of his income for the Assessment Year 2025-26:
- Salary (Gross before deductions): ₹12,00,000
- Income from House Property (Self-occupied interest on loan): ₹1,80,000
- Interest from Bank Fixed Deposit: ₹60,000
- Contribution to PPF: ₹1,50,000
- Medical Insurance Premium for self paid by cheque: ₹25,000
Calculate the total income and tax liability of Mr. Rohan under the Default Tax Regime under Section 115BAC of the Income-tax Act, 1961. Clearly explain which deductions are permissible and which are not allowed.

SECTION B: GOODS AND SERVICES TAX (GST) (10 MARKS)
Q2. (10 Marks)
XYZ Ltd., a registered manufacturer of electronic appliances in Maharashtra, provides details of input tax credit (ITC) on inward supplies for November 2025:
(i) Motor vehicles purchased for factory transportation of raw materials (seating capacity 5 persons): GST ₹1,80,000.
(ii) Motor vehicles purchased for transportation of senior executive directors (seating capacity 5 persons): GST ₹2,40,000.
(iii) Outdoor catering services availed for the annual general meeting of employees required as a statutory condition under the Factories Act: GST ₹45,000.
(iv) Goods lost by fire in factory warehouse: GST ₹60,000.
(v) General insurance policy taken for factory plant & machinery: GST ₹30,000.
Determine the amount of eligible Input Tax Credit (ITC) available to XYZ Ltd. with specific reference to Section 17(5) and Section 16 of the CGST Act, 2017.

============================================================
=== CANDIDATE ANSWER SHEET: ROLL NO: SRO-INTER-2026-412 ===
============================================================

Answer 1:
Computation of Total Income & Tax Liability of Mr. Rohan under Default Tax Regime u/s 115BAC (A.Y. 2025-26):

1. Income from Salaries:
   - Gross Salary: ₹12,00,000
   - Less: Standard deduction under Section 16(ia) allowed under 115BAC: ₹75,000
   - Net Salary: ₹11,25,000

2. Income from House Property:
   - Self-occupied property interest under Section 24(b) is NOT deductible under Section 115BAC.
   - Loss of ₹1,80,000 cannot be set off against Salary or other income under 115BAC.
   - Income from House Property = NIL.

3. Income from Other Sources:
   - Interest on Bank Fixed Deposit = ₹60,000.

Gross Total Income = ₹11,25,000 + ₹60,000 = ₹11,85,000.

4. Deductions under Chapter VI-A:
   - Section 80C (PPF): NOT allowable under Section 115BAC.
   - Section 80D (Mediclaim): NOT allowable under Section 115BAC.
   Total Deductions = NIL.

Total Income = ₹11,85,000.

Tax Computation under Section 115BAC Slab Rates:
- Up to ₹3,00,000: Nil
- ₹3,00,001 to ₹7,00,000 (₹4,00,000 @ 5%): ₹20,000
- ₹7,00,001 to ₹10,00,000 (₹3,00,000 @ 10%): ₹30,000
- ₹10,00,001 to ₹11,85,000 (₹1,85,000 @ 15%): ₹27,750
Basic Tax = ₹20,000 + ₹30,000 + ₹27,750 = ₹77,750.
Add: Health and Education Cess @ 4% = ₹3,110.
Total Tax Liability = ₹80,860.

---

Answer 2:
Eligibility of Input Tax Credit (ITC) for XYZ Ltd. under CGST Act, 2017:

1. Motor vehicles for raw materials transport (seating capacity 5):
   - Under Section 17(5)(a), motor vehicle for transportation of persons with seating capacity <= 13 is blocked. However, this is used for transportation of goods/raw materials. If the vehicle is primarily a goods carriage, ITC is eligible. Assuming standard motor car adapted for passenger use, it is blocked. But if goods transport vehicle, eligible. As per facts, seating capacity is 5 persons (passenger vehicle), hence BLOCKED u/s 17(5)(a). ITC = ₹0.

2. Motor vehicles for directors (seating capacity 5 persons):
   - Blocked under Section 17(5)(a) as seating capacity is not more than 13 persons and not used for making taxable supplies of vehicles or driving instruction. ITC = ₹0.

3. Outdoor catering for employees:
   - Under Section 17(5)(b)(i), outdoor catering is normally blocked.
   - Proviso to Section 17(5)(b): ITC is available if it is statutory obligation for an employer to provide the same to its employees under any law. Since it is mandated under Factories Act, ITC is ELIGIBLE. ITC = ₹45,000.

4. Goods lost by fire:
   - Blocked under Section 17(5)(h) - goods lost, stolen, destroyed, written off or disposed of by way of gift or free samples. ITC = ₹0.

5. General Insurance on Plant & Machinery:
   - Plant & Machinery is used in business and does not fall under blocked categories of Section 17(5). Insurance is fully eligible u/s 16(1). ITC = ₹30,000.

Total Eligible ITC = ₹45,000 + ₹30,000 = ₹75,000.
`
  },
  {
    id: 'sample_neet_biology_mock',
    title: 'NEET (UG) Biology: Genetics, Human Physiology & Molecular Basis of Inheritance',
    journey: 'NEET',
    level: 'NEET (UG) Medical',
    subject: 'Biology',
    chapter: 'Molecular Basis of Inheritance & Human Physiology',
    difficulty: 'NTA NEET Exam Level',
    totalMarks: 32,
    description: 'High-yield NEET Biology paper featuring NCERT line-by-line MCQs, Assertion-Reasoning, Statement pairs, and physiological mechanisms with student answer sheet.',
    documentContent: `=== NTA NEET (UG) MEDICAL ENTRANCE MOCK TEST: BIOLOGY ===
TIME: 45 MINS | TOTAL MARKS: 32 (8 QUESTIONS × 4 MARKS EACH, -1 FOR WRONG ANSWER)

SECTION A: OBJECTIVE & REASONING QUESTIONS (16 MARKS)
Q1. [MCQ - Genetics]: In a Mendelian dihybrid cross between round yellow seeds (RRYY) and wrinkled green seeds (rryy), what is the phenotypic ratio obtained in the F2 generation? [4 Marks]
    (A) 9 : 3 : 3 : 1
    (B) 1 : 2 : 1 : 2 : 4 : 2 : 1 : 2 : 1
    (C) 9 : 7
    (D) 15 : 1

Q2. [Assertion-Reason - Molecular Genetics]: [4 Marks]
    Assertion (A): The genetic code is degenerate.
    Reason (R): Most amino acids are specified by more than one codon.
    (A) Both (A) and (R) are true and (R) is the correct explanation of (A).
    (B) Both (A) and (R) are true but (R) is NOT the correct explanation of (A).
    (C) (A) is true but (R) is false.
    (D) Both (A) and (R) are false.

Q3. [Statement Analysis - Human Endocrine System]: [4 Marks]
    Statement I: Glucagon is a peptide hormone secreted by alpha cells of Islets of Langerhans and increases blood glucose levels (hyperglycemia).
    Statement II: Insulin promotes glycogenolysis and gluconeogenesis in hepatocytes.
    (A) Both Statement I and Statement II are correct.
    (B) Both Statement I and Statement II are incorrect.
    (C) Statement I is correct but Statement II is incorrect.
    (D) Statement I is incorrect but Statement II is correct.

Q4. [Match Column - Biotechnology Vectors]: [4 Marks]
    Column I (Enzyme / Tool)       Column II (Function / Source)
    (a) EcoRI                       (p) Thermus aquaticus (Taq polymerase)
    (b) DNA Ligase                  (q) Cleaves DNA at 5'-GAATTC-3' palindromic sequence
    (c) Taq Polymerase              (r) Joins phosphodiester backbone of Okazaki fragments
    (d) pBR322                      (s) Plasmid vector with ampR and tetR selectable markers
    Choose the correct option:
    (A) a-(q), b-(r), c-(p), d-(s)
    (B) a-(p), b-(q), c-(r), d-(s)
    (C) a-(s), b-(r), c-(p), d-(q)
    (D) a-(q), b-(p), c-(r), d-(s)

SECTION B: DESCRIPTIVE & MECHANISM REVIEW (16 MARKS)
Q5. [Human Physiology - Excretory System]: Explain the Counter-Current Mechanism operating in the Loop of Henle and Vasa Recta for concentrating urine. State the role of ADH (Vasopressin) in osmoregulation. [4 Marks]

Q6. [Cell Biology & Photosynthesis]: Distinguish between C3 and C4 pathways of carbon fixation in plants. Why do C4 plants exhibit higher photosynthetic efficiency and lack photorespiration? [4 Marks]

Q7. [Molecular Biology - Lac Operon]: Describe the regulation of the Lac Operon in Escherichia coli in the presence and absence of lactose (inducer). Mention the enzymes coded by genes z, y, and a. [4 Marks]

Q8. [Ecology & Biodiversity]: State the rivet popper hypothesis proposed by Paul Ehrlich and explain why loss of species in tropical rainforests has profound impacts on ecosystem stability. [4 Marks]

============================================================
=== CANDIDATE ANSWER SHEET: NEET ROLL NO: 2026-MED-9941 ===
============================================================

Answer 1:
Option (A) is correct.
Explanation: In Mendel's dihybrid cross of Round Yellow (RRYY) × Wrinkled Green (rryy), the F1 generation is heterozygous RrYy. In the F2 generation produced by selfing, 4 phenotypic classes appear:
- Round Yellow = 9
- Round Green = 3
- Wrinkled Yellow = 3
- Wrinkled Green = 1
Phenotypic Ratio = 9 : 3 : 3 : 1. Option (B) is the genotypic ratio.

Answer 2:
Option (A) is correct.
Explanation: The genetic code is called 'degenerate' because 61 codons code for 20 amino acids. Thus, except for Methionine (AUG) and Tryptophan (UGG), single amino acids are coded by multiple codons (e.g., Leucine, Serine, Arginine have 6 codons each). Hence Reason correctly explains Assertion.

Answer 3:
Option (C) is correct.
Explanation:
- Statement I is correct: Glucagon is synthesized by alpha-cells of pancreas and acts mainly on liver cells to stimulate glycogenolysis and gluconeogenesis, elevating blood glucose (hyperglycemic hormone).
- Statement II is incorrect: Insulin stimulates glycogenesis (conversion of glucose to glycogen) and enhances cellular glucose uptake; it inhibits glycogenolysis and gluconeogenesis.

Answer 4:
Option (A) is correct.
Matching:
- EcoRI -> Restriction endonuclease isolated from E. coli RY13 which recognizes 5'-G/AATTC-3' palindrome (q).
- DNA Ligase -> Molecular glue that seals nicks by forming phosphodiester bonds (r).
- Taq Polymerase -> Thermostable DNA polymerase from Thermus aquaticus used in PCR extension step (p).
- pBR322 -> Standard cloning vector containing ampicillin and tetracycline resistance genes (s).

Answer 5:
Counter-Current Mechanism:
1. Flow of filtrate in the two limbs of Henle's loop is in opposite directions, and flow of blood in the two limbs of Vasa Recta is also in opposite directions, forming a counter-current multiplier system.
2. The ascending limb of Henle transports NaCl into the medullary interstitium, which is exchanged with the descending limb of vasa recta.
3. Urea enters the thin segment of the ascending limb and is returned to the medullary interstitium by the collecting duct.
4. This maintains an osmolarity gradient from 300 mOsmol/L in the cortex to 1200 mOsmol/L in the inner medulla.
Role of ADH:
- When body fluid osmolarity rises, osmoreceptors stimulate hypothalamus to release ADH from neurohypophysis.
- ADH makes the DCT and collecting duct permeable to water, facilitating water reabsorption and producing concentrated (hypertonic) urine.

Answer 6:
Differences between C3 and C4 Plants:
1. Primary CO2 Acceptor: RuBP (5C compound) in C3 plants; PEP (Phosphoenolpyruvate, 3C) in C4 plants.
2. Primary Carboxylating Enzyme: RuBisCO in C3; PEP carboxylase (PEPcase) in C4 mesophyll cells.
3. Anatomy: C4 plants possess Kranz Anatomy (large bundle sheath cells with agranal chloroplasts surrounding vascular bundles).
4. Absence of Photorespiration:
   - In C4 plants, PEPcase has high affinity for CO2 and no oxygenase activity.
   - Decarboxylation of C4 acid (Malic acid) in bundle sheath cells releases high concentration of CO2 near RuBisCO, completely preventing its oxygenase activity.
   - Hence, C4 plants do not waste energy in photorespiration and show higher productivity.

Answer 7:
Regulation of Lac Operon in E. coli:
1. Structural Genes and their Enzymes:
   - gene z: codes for beta-galactosidase (hydrolyses lactose into glucose + galactose).
   - gene y: codes for beta-galactoside permease (increases cell membrane permeability to beta-galactosides).
   - gene a: codes for beta-galactoside transacetylase.
2. In Absence of Inducer (Lactose):
   - The i-gene constantly transcribes repressor mRNA, which synthesizes repressor protein.
   - Active repressor binds to the operator region (o) of the operon and prevents RNA polymerase from transcribing the structural genes (Switch OFF).
3. In Presence of Inducer (Lactose/Allolactose):
   - Inducer binds to the repressor protein, inactivating it via conformational change.
   - Inactive repressor cannot bind to the operator.
   - RNA polymerase binds to promoter (p) and transcribes polycistronic mRNA, synthesizing all three enzymes (Switch ON).

Answer 8:
Rivet Popper Hypothesis:
1. Proposed by Stanford ecologist Paul Ehrlich using an airplane analogy to explain ecosystem stability:
   - Airplane represents the ecosystem.
   - Rivets holding parts together represent species.
   - If every passenger pops a rivet (species becomes extinct), initially flight safety (ecosystem function) may not be impaired.
   - But as more rivets are removed, the plane becomes dangerously weak.
   - Removing a rivet from a critical part like the wings (loss of a keystone species that drives major ecosystem dynamics) poses immediate disaster compared to removing a rivet from a seat.
2. In tropical rainforests, species are tightly co-evolved; loss of keystone pollinators, seed dispersers, or top predators triggers trophic cascades and secondary extinctions, leading to ecosystem collapse.
`
  },
  {
    id: 'sample_neet_physics_chem_mock',
    title: 'NEET (UG) Physics & Chemistry: Electrodynamics, Thermodynamics & Organic Mechanisms',
    journey: 'NEET',
    level: 'NEET (UG) Medical',
    subject: 'Physics',
    chapter: 'Current Electricity & Chemical Thermodynamics',
    difficulty: 'NTA NEET Exam Level',
    totalMarks: 24,
    description: 'High-yield Physics and Chemistry NEET questions with numerical steps, circuit derivations, Nernst equation calculations, and organic mechanism questions.',
    documentContent: `=== NTA NEET (UG) PHYSICS & CHEMISTRY COMBO MOCK TEST ===
TIME: 40 MINS | TOTAL MARKS: 24 (6 QUESTIONS × 4 MARKS EACH)

Q1. [Physics - Current Electricity]: A potentiometer wire of length 10 m and resistance 20 Ω is connected in series with a battery of EMF 5 V (internal resistance 0 Ω) and an external resistance R. If a standard cell of EMF 1.08 V is balanced at a wire length of 6 m, find the value of resistance R. [4 Marks]

Q2. [Physics - Electrostatics & Capacitors]: A parallel plate capacitor with air between plates has a capacitance of 8 pF. What will be the capacitance if the distance between plates is reduced by half and the space between them is filled with a dielectric substance of dielectric constant K = 6? [4 Marks]

Q3. [Physics - Modern Physics / Photoelectric Effect]: Light of frequency 1.5 times the threshold frequency is incident on a photosensitive material. If the frequency of incident light is halved and its intensity is doubled, what will happen to the photoelectric current? Explain using Einstein's photoelectric equation. [4 Marks]

Q4. [Chemistry - Electrochemistry / Nernst Equation]: Calculate the EMF of the following Galvanic cell at 298 K:
    Zn(s) | Zn2+(aq, 0.01 M) || Cu2+(aq, 0.1 M) | Cu(s)
    Given: E°(Zn2+/Zn) = -0.76 V, E°(Cu2+/Cu) = +0.34 V, and 2.303 RT/F = 0.0591 V. [4 Marks]

Q5. [Chemistry - Chemical Thermodynamics]: For a certain reaction at 298 K, ΔH = -40.0 kJ/mol and ΔS = -80.0 J/(K·mol).
    (a) Calculate ΔG° for the reaction.
    (b) Predict whether the reaction is spontaneous at 298 K.
    (c) At what temperature will the reaction attain equilibrium? [4 Marks]

Q6. [Chemistry - Organic Chemistry / Haloalkanes]: Explain why alkyl halides undergo nucleophilic substitution via SN1 mechanism in polar protic solvents while SN2 mechanism is favored in polar aprotic solvents. Contrast the stereochemical outcomes of SN1 and SN2 reactions. [4 Marks]

============================================================
=== CANDIDATE ANSWER SHEET: NEET ROLL NO: 2026-MED-8812 ===
============================================================

Answer 1:
Given:
- Length of potentiometer wire L = 10 m
- Resistance of wire R_wire = 20 Ω
- EMF of primary battery E = 5 V
- Balancing length l = 6 m
- Balanced EMF E2 = 1.08 V

Potential Gradient along the wire (k):
k = E2 / l = 1.08 V / 6 m = 0.18 V/m

Total potential drop across wire (V_wire):
V_wire = k × L = 0.18 V/m × 10 m = 1.8 V

Current in primary circuit (I):
I = V_wire / R_wire = 1.8 V / 20 Ω = 0.09 A

Total resistance of primary circuit:
R_total = E / I = 5 V / 0.09 A = 500 / 9 Ω = 55.56 Ω

External series resistance R:
R = R_total - R_wire = 55.56 - 20 = 35.56 Ω (or 320/9 Ω).

Answer 2:
Original Capacitance with air (C0):
C0 = ε0 A / d = 8 pF

When distance is halved: d' = d / 2
When dielectric of constant K = 6 is inserted:
New Capacitance (C'):
C' = K × ε0 A / d' = K × ε0 A / (d / 2) = 2 K × (ε0 A / d) = 2 K × C0
C' = 2 × 6 × 8 pF = 12 × 8 pF = 96 pF.
The new capacitance is 96 pF.

Answer 3:
According to Einstein's Photoelectric Equation:
KE_max = hν - hν0
Initial frequency ν1 = 1.5 ν0 (greater than threshold frequency ν0, so photoelectric emission occurs).

When frequency is halved:
New frequency ν2 = ν1 / 2 = 1.5 ν0 / 2 = 0.75 ν0.
Since the new incident frequency ν2 (0.75 ν0) is strictly LESS than the threshold frequency ν0, no photoelectrons will be emitted, regardless of the intensity of light.
Therefore, the photoelectric current becomes ZERO (0).

Answer 4:
Standard Cell Potential (E°cell):
E°cell = E°cathode - E°anode = E°(Cu2+/Cu) - E°(Zn2+/Zn)
E°cell = +0.34 V - (-0.76 V) = +1.10 V

Cell Reaction:
Zn(s) + Cu2+(aq) -> Zn2+(aq) + Cu(s), where n = 2 electrons transferred.

Reaction Quotient (Q):
Q = [Zn2+] / [Cu2+] = 0.01 M / 0.1 M = 0.1 = 10^(-1)

Nernst Equation at 298 K:
Ecell = E°cell - (0.0591 / n) log Q
Ecell = 1.10 - (0.0591 / 2) log(0.1)
Ecell = 1.10 - (0.02955) × (-1)
Ecell = 1.10 + 0.02955 = 1.12955 V ≈ 1.13 V.

Answer 5:
(a) Calculation of ΔG° at 298 K:
ΔH = -40.0 kJ/mol = -40,000 J/mol
ΔS = -80.0 J/(K·mol)
T = 298 K
ΔG° = ΔH - TΔS
ΔG° = -40,000 - [298 × (-80.0)]
ΔG° = -40,000 + 23,840 = -16,160 J/mol = -16.16 kJ/mol.

(b) Spontaneity:
Since ΔG° is negative (-16.16 kJ/mol < 0), the reaction is SPONTANEOUS at 298 K.

(c) Temperature at Equilibrium:
At equilibrium, ΔG = 0 => T_eq = ΔH / ΔS
T_eq = -40,000 J/mol / -80.0 J/(K·mol) = 500 K.
The reaction is at equilibrium at 500 K (227 °C).

Answer 6:
1. Solvent Effect on SN1 vs SN2:
   - SN1 Mechanism involves formation of a carbocation intermediate in the rate-determining step. Polar protic solvents (e.g. H2O, ROH) have high dielectric constants and hydrogen-bond with leaving groups and carbocations, stabilizing the ionic transition state and carbocation, accelerating SN1.
   - SN2 Mechanism proceeds via a single concerted transition state with backside nucleophilic attack. Polar aprotic solvents (e.g. Acetone, DMSO, DMF) solvate cations leaving nucleophiles 'naked' and highly reactive without shielding them by hydrogen bonds, which maximizes nucleophilicity and favors SN2.

2. Stereochemical Outcomes:
   - SN1: Since carbocation is planar (sp2 hybridized), nucleophile can attack equally from either face (front or back). This results in RACEMISATION (formation of a 50:50 enantiomeric mixture, though partial inversion often slightly dominates due to ion-pair shielding).
   - SN2: Nucleophile attacks strictly from 180° opposite to the leaving group (backside attack). This leads to 100% WALDEN INVERSION of configuration at the asymmetric carbon center.
`
  },
  {
    id: 'sample_jee_physics_maths',
    title: 'JEE Advanced: Rotational Mechanics, Motional EMF & Definite Integrals',
    journey: 'JEE',
    level: 'JEE Main & Advanced',
    subject: 'Physics',
    chapter: 'Rotational Dynamics (Torque, Moment of Inertia, Pure Rolling & Angular Momentum Conservation)',
    difficulty: 'IIT JEE Advanced Benchmark',
    totalMarks: 32,
    description: 'Authentic 32-mark JEE Advanced engineering test covering Pure Rolling Dynamics on Incline, Faraday-Lenz Motional EMF in magnetic fields, and Calculus Definite Integral evaluation.',
    documentContent: `=== QUESTION PAPER: JEE ADVANCED (PHYSICS & MATHEMATICS) ===
MAX MARKS: 32 | TIME: 1 HOUR | NEGATIVE MARKING: -1 / -2 AS PER IIT ADVANCED PATTERN

SECTION 1: PHYSICS - ROTATIONAL DYNAMICS & ROLLING (10 MARKS)
Q1. A solid cylinder of mass M and radius R is placed on an inclined plane of angle θ with the horizontal. The coefficient of static friction is μs.
    (a) Derive the expression for linear acceleration a_cm of the cylinder undergoing pure rolling down the incline.
    (b) Find the minimum value of coefficient of static friction μ_s required to ensure pure rolling without slipping.
    (c) If the cylinder is released from rest at height h, calculate its angular velocity ω when it reaches the bottom.
    [10 Marks]

SECTION 2: PHYSICS - ELECTROMAGNETIC INDUCTION (10 MARKS)
Q2. A conducting rod PQ of length L, mass m and electrical resistance R is free to slide without friction along two vertical parallel conducting rails connected at the top with a capacitance C and a switch. A uniform horizontal magnetic field B exists perpendicular to the plane of the rails into the page.
    (a) Derive the differential equation of motion of the rod falling under gravity after the circuit is closed.
    (b) Show that the rod falls with a constant acceleration a < g and determine the exact expression for this acceleration.
    [10 Marks]

SECTION 3: MATHEMATICS - DEFINITE INTEGRALS & LEIBNIZ RULE (12 MARKS)
Q3. (a) Evaluate the definite integral:
        I = ∫_{0}^{π} \\frac{x \\sin x}{1 + \\cos^2 x} dx
    (b) Let f(x) be a continuous function such that:
        ∫_{0}^{x^2} f(t) dt = x^2 \\cos(π x) for all x > 0.
        Find the exact value of f(4).
    [12 Marks]

============================================================
=== CANDIDATE ANSWER SHEET: ROLL NO: IIT-JEE-2026-ADV-401 ===
============================================================

Ans 1:
(a) Linear acceleration of solid cylinder in pure rolling:
Let cylinder have mass M, radius R.
Forces acting on cylinder along the incline:
Component of gravity down the incline: Mg sin θ
Friction force acting up the incline at contact point: f_s
Equation of translational motion down the incline:
Mg sin θ - f_s = M a_cm   ---- (Eq. 1)

Equation of rotational motion about centre of mass:
Torque τ_cm = f_s × R = I_cm × α
For a solid uniform cylinder, Moment of Inertia I_cm = 1/2 M R²
So, f_s × R = (1/2 M R²) α   => f_s = 1/2 M (Rα)

Condition for pure rolling without slipping: a_cm = Rα
Therefore, f_s = 1/2 M a_cm   ---- (Eq. 2)

Substituting Eq. 2 into Eq. 1:
Mg sin θ - 1/2 M a_cm = M a_cm
Mg sin θ = 3/2 M a_cm
a_cm = (2/3) g sin θ

(b) Minimum static friction coefficient μ_s:
From Eq. 2, required friction force f_s = (1/2) M ((2/3) g sin θ) = (1/3) Mg sin θ
Normal reaction N = Mg cos θ
For no slipping: f_s ≤ f_s,max = μ_s N
(1/3) Mg sin θ ≤ μ_s (Mg cos θ)
μ_s ≥ (1/3) tan θ
Thus, minimum μ_s = (1/3) tan θ.

(c) Angular velocity at bottom:
By conservation of mechanical energy:
Potential energy lost = Kinetic energy gained
Mgh = (1/2) M v_cm² + (1/2) I_cm ω²
Since v_cm = Rω and I_cm = (1/2) M R²:
Mgh = (1/2) M (Rω)² + (1/2) (1/2 M R²) ω²
Mgh = (1/2) M R² ω² + (1/4) M R² ω² = (3/4) M R² ω²
ω² = (4gh) / (3R²)
ω = sqrt(4gh / 3R²) = (2/R) sqrt(gh / 3).

Ans 2:
(a) Differential equation for conducting rod falling through magnetic field:
When rod moves downward with velocity v, motional EMF induced across rod PQ:
ε = B v L
Charge on capacitor C: q = C ε = C B L v
Current through rod: i = dq/dt = C B L (dv/dt) = C B L a, where a = dv/dt is acceleration.
Magnetic upward Lorentz force on current-carrying rod:
F_m = i L B = (C B L a) L B = C B² L² a

Equation of motion for falling mass m under gravity:
mg - F_m = m a
mg - C B² L² a = m a

(b) Expression for constant acceleration:
mg = (m + C B² L² ) a
a = (m g) / (m + C B² L²) = g / [ 1 + (C B² L² / m) ]
Since C, B, L, m are all positive non-zero constants, the denominator is strictly > 1.
Therefore, the rod accelerates with a CONSTANT acceleration a < g throughout its downward motion.

Ans 3:
(a) Evaluating I = ∫_{0}^{π} [x sin x / (1 + cos² x)] dx:
Let I = ∫_{0}^{π} \\frac{x \\sin x}{1 + \\cos^2 x} dx   ---- (1)
Using King's Property: ∫_{0}^{a} f(x) dx = ∫_{0}^{a} f(a - x) dx:
I = ∫_{0}^{π} \\frac{(π - x) \\sin(π - x)}{1 + \\cos^2(π - x)} dx
Since sin(π - x) = sin x and cos(π - x) = -cos x (so cos²(π - x) = cos² x):
I = ∫_{0}^{π} \\frac{(π - x) \\sin x}{1 + \\cos^2 x} dx   ---- (2)

Adding (1) and (2):
2I = ∫_{0}^{π} \\frac{[x + (π - x)] \\sin x}{1 + \\cos^2 x} dx
2I = π ∫_{0}^{π} \\frac{\\sin x}{1 + \\cos^2 x} dx
I = (π / 2) ∫_{0}^{π} \\frac{\\sin x}{1 + \\cos^2 x} dx

Substitute u = cos x => du = -sin x dx:
When x = 0, u = 1; When x = π, u = -1.
I = (π / 2) ∫_{1}^{-1} \\frac{-du}{1 + u^2}
I = (π / 2) ∫_{-1}^{1} \\frac{du}{1 + u^2}
I = (π / 2) [ tan^(-1)(u) ]_{-1}^{1}
I = (π / 2) [ tan^(-1)(1) - tan^(-1)(-1) ]
I = (π / 2) [ π/4 - (-π/4) ] = (π / 2) [ π/2 ] = π² / 4.

(b) Finding f(4) using Leibniz Rule:
Given: ∫_{0}^{x^2} f(t) dt = x^2 cos(π x)
Differentiating both sides with respect to x using Leibniz Rule:
d/dx [ ∫_{0}^{x^2} f(t) dt ] = d/dx [ x^2 cos(π x) ]
f(x^2) · (d/dx(x^2)) - f(0) · 0 = 2x cos(π x) + x^2 (-π sin(π x))
f(x^2) · (2x) = 2x cos(π x) - π x^2 sin(π x)

Dividing both sides by 2x (for x > 0):
f(x^2) = cos(π x) - (π x / 2) sin(π x)

To find f(4), set x^2 = 4 => x = 2:
f(4) = cos(2π) - (π · 2 / 2) sin(2π)
Since cos(2π) = 1 and sin(2π) = 0:
f(4) = 1 - π(0) = 1.
`
  },
  {
    id: 'sample_jee_chemistry',
    title: 'JEE Main & Advanced: Thermodynamics, Coordination Chemistry & Reaction Mechanisms',
    journey: 'JEE',
    level: 'JEE Main & Advanced',
    subject: 'Chemistry',
    chapter: 'General Organic Chemistry (GOC: Carbocations, Carbanions, Free Radicals Stability & Acidity/Basicity Comparisons)',
    difficulty: 'NTA JEE Main & Advanced Standard',
    totalMarks: 30,
    description: 'Chemistry paper testing thermodynamics spontaneity calculations, Crystal Field Stabilization Energy (CFSE), and multi-step carbocation rearrangement mechanisms.',
    documentContent: `=== QUESTION PAPER: JEE MAIN & ADVANCED CHEMISTRY ===
MAX MARKS: 30 | TIME: 45 MINUTES | NTA / IIT JEE BENCHMARK

Q1. (Organic Reaction Mechanism):
    Predict the major organic product and show the step-by-step reaction mechanism with carbocation rearrangements when 3,3-dimethylbutan-2-ol is heated with concentrated H2SO4.
    [10 Marks]

Q2. (Inorganic Coordination Chemistry):
    For the octahedral complex [Fe(CN)6]4- and [Fe(H2O)6]2+ (Atomic number of Fe = 26):
    (a) Write the oxidation state and d-electron configuration of iron in both complexes.
    (b) Predict whether each complex is high-spin or low-spin with electronic arrangement (t2g / eg).
    (c) Calculate the magnetic moment (spin-only) in Bohr Magnetons (BM) for both complexes.
    [10 Marks]

Q3. (Physical Chemistry - Thermodynamics & Equilibrium):
    For the gas phase reaction: N2O4(g) <=> 2 NO2(g)
    Given standard thermodynamic data at 298 K:
    ΔH° = +57.2 kJ/mol, ΔS° = +176.0 J/(K·mol).
    (a) Calculate the standard Gibbs Free Energy change ΔG° at 298 K.
    (b) Calculate the equilibrium constant Kp at 298 K (Use R = 8.314 J/(mol·K)).
    (c) Predict the effect of increasing temperature and increasing total pressure on the equilibrium yield of NO2.
    [10 Marks]

============================================================
=== CANDIDATE ANSWER SHEET: ROLL NO: IIT-JEE-CHEM-2026-118 ===
============================================================

Ans 1:
Substrate: 3,3-dimethylbutan-2-ol: CH3-C(CH3)2-CH(OH)-CH3
Reaction: Acid-catalyzed dehydration with concentrated H2SO4.

Step 1: Protonation of alcohol hydroxyl group
CH3-C(CH3)2-CH(OH)-CH3 + H+ <=> CH3-C(CH3)2-CH(OH2+)-CH3

Step 2: Loss of water molecule to form secondary carbocation
CH3-C(CH3)2-CH(OH2+)-CH3 -> CH3-C(CH3)2-C+H-CH3 (Secondary 2° Carbocation) + H2O

Step 3: 1,2-Methyl Shift (Carbocation Rearrangement)
The adjacent carbon is quaternary with three methyl groups. A 1,2-methyl shift occurs to transform the less stable 2° carbocation into a highly stable 3° (tertiary) carbocation:
CH3-C(CH3)2-C+H-CH3 --(1,2-methyl shift)--> CH3-C+(CH3)-CH(CH3)-CH3 (Tertiary 3° Carbocation)

Step 4: Elimination of proton (E1 mechanism) following Saytzeff Rule
Loss of proton from C3 gives the most highly substituted, hyperconjugation-stabilized alkene:
Major Product: 2,3-dimethylbut-2-ene (CH3-C(CH3)=C(CH3)-CH3) having 12 α-hydrogens.
Minor Product: 2,3-dimethylbut-1-ene (CH2=C(CH3)-CH(CH3)-CH3).

Ans 2:
Iron atomic number Z = 26; neutral ground state configuration = [Ar] 3d6 4s2.
(a) In both [Fe(CN)6]4- and [Fe(H2O)6]2+:
    - Let oxidation state of Fe be x:
      In [Fe(CN)6]4-: x + 6(-1) = -4 => x = +2 (Fe2+)
      In [Fe(H2O)6]2+: x + 6(0) = +2 => x = +2 (Fe2+)
    - Fe2+ electronic configuration = [Ar] 3d6.

(b) Crystal Field Splitting:
    - [Fe(CN)6]4-: CN- is a strong field ligand (Δo > P, pairing energy).
      Electrons pair up in lower energy t2g orbitals: Configuration = t2g^6 eg^0.
      It is a LOW-SPIN (inner orbital d2sp3) diamagnetic complex.
    - [Fe(H2O)6]2+: H2O is a weak field ligand (Δo < P).
      Electrons remain unpaired following Hund's rule: Configuration = t2g^4 eg^2.
      It is a HIGH-SPIN (outer orbital sp3d2) paramagnetic complex.

(c) Spin-only magnetic moment μ = sqrt(n(n+2)) BM:
    - For [Fe(CN)6]4-: Unpaired electrons n = 0 => μ = 0 BM (Diamagnetic).
    - For [Fe(H2O)6]2-: Unpaired electrons n = 4 => μ = sqrt(4(4+2)) = sqrt(24) ≈ 4.90 BM.

Ans 3:
(a) Standard Gibbs Free Energy change ΔG° at 298 K:
ΔH° = +57.2 kJ/mol = 57,200 J/mol
ΔS° = +176.0 J/(K·mol)
T = 298 K
ΔG° = ΔH° - TΔS°
ΔG° = 57,200 - (298 × 176.0)
ΔG° = 57,200 - 52,448 = +4,752 J/mol = +4.752 kJ/mol.

(b) Calculation of Equilibrium Constant Kp:
ΔG° = -RT ln Kp = -2.303 RT log10 Kp
4752 = -2.303 × 8.314 × 298 × log10 Kp
4752 = -5705.8 × log10 Kp
log10 Kp = -4752 / 5705.8 = -0.8328
Kp = 10^(-0.8328) ≈ 0.147 atm.

(c) Le Chatelier's Principle Predictions:
1. Effect of Temperature Increase:
   The forward reaction is endothermic (ΔH° > 0). Increasing temperature shifts equilibrium in endothermic direction (forward), increasing Kp and yielding MORE NO2.
2. Effect of Pressure Increase:
   Forward reaction involves increase in moles of gas (Δng = 2 - 1 = +1). Increasing total pressure shifts equilibrium toward side with fewer moles of gas (backward direction), decreasing the equilibrium yield of NO2.
`
  },
  {
    id: 'sample_cuet_general_test_model',
    title: 'CUET (UG) General Test Section III: Quantitative Aptitude, Syllogisms & Indian Polity',
    journey: 'CUET',
    level: 'CUET (UG) NTA',
    subject: 'General Test (Section III)',
    chapter: 'Percentages, Profit and Loss & Discount Calculations',
    difficulty: 'NTA CUET Standard',
    totalMarks: 25,
    description: 'NTA CUET Section III paper featuring Speed Time Distance, Venn Syllogisms, Constitutional Polity, and Successive Discounts.',
    documentContent: `=== QUESTION PAPER: NTA CUET (UG) GENERAL TEST (SECTION III | MAX MARKS: 25) ===
MARKING SCHEME: +5 Marks per correct response, -1 Mark for incorrect answer

Q1. A merchant marks an article 40% above its cost price (CP) and offers two successive discounts of 20% and 10% on the marked price.
    (a) Find the single equivalent discount percentage of the two successive discounts.
    (b) If the cost price is ₹2,500, calculate final selling price (SP) and net profit/loss percentage. [5 Marks]

Q2. Two trains 180 m and 220 m in length are running on parallel tracks. In same direction, faster train passes slower in 40 seconds; in opposite direction, they pass in 8 seconds.
    (a) Determine the speed of each train in m/s and km/h.
    (b) How much time will the faster train take to completely cross a 320 m platform? [5 Marks]

Q3. Syllogism & Logical Deduction:
    Statements:
    I. All scientists are thinkers.
    II. Some thinkers are poets.
    III. No poet is a politician.
    Evaluate which conclusions logically follow with Venn diagram reasoning:
    (i) Some thinkers are not politicians.
    (ii) Some scientists are poets.
    (iii) No scientist is a politician. [5 Marks]

Q4. Indian Polity & Governance:
    (a) Name the Article providing the 'Right to Constitutional Remedies' and explain why Dr. Ambedkar called it the 'Heart and Soul' of the Constitution.
    (b) Distinguish between Repo Rate and Reverse Repo Rate regulated by the RBI. [5 Marks]

Q5. Set Theory & Data Interpretation:
    In an exam of 1,200 students, 65% passed Quantitative, 55% passed Reasoning, and 10% failed both.
    (a) Calculate percentage and number of students passing BOTH.
    (b) How many passed ONLY Quantitative? [5 Marks]

=== STUDENT'S SUBMITTED ANSWER SCRIPT ===
Student: Aditi Sharma | Roll No: CUET-2026-UG-48291

Ans 1:
(a) Successive discounts d1 = 20%, d2 = 10%:
Single equivalent discount = d1 + d2 - (d1 * d2) / 100
= 20 + 10 - (200 / 100) = 30 - 2 = 28%.

(b) CP = ₹2,500
Marked Price (MP) = 2500 + 40% of 2500 = 2500 + 1000 = ₹3,500.
Discount = 28% of 3500 = 0.28 * 3500 = ₹980.
SP = 3500 - 980 = ₹2,520.
Net Profit = SP - CP = 2520 - 2500 = ₹20.
Profit % = (20 / 2500) * 100 = 0.8% Profit.

Ans 2:
(a) Faster train = u, Slower train = v. Total length = 180 + 220 = 400 m.
- Same direction: 400 = (u - v) * 40 => u - v = 10 m/s  --- (1)
- Opposite direction: 400 = (u + v) * 8 => u + v = 50 m/s --- (2)
Adding (1) and (2): 2u = 60 => u = 30 m/s.
From (1): v = 30 - 10 = 20 m/s.
In km/h:
Faster train u = 30 * (18/5) = 108 km/h.
Slower train v = 20 * (18/5) = 72 km/h.

(b) Crossing platform of 320 m:
Total distance = 180 + 320 = 500 m.
Time = 500 / 30 = 50/3 seconds = 16.67 seconds.

Ans 3:
- S is inside T.
- T and P intersect.
- P and Pol are completely separated.
Evaluation:
- Conclusion (i): Those thinkers that are poets cannot be politicians because no poet is a politician. Hence, some thinkers are definitely not politicians. This FOLLOWS.
- Conclusion (ii): S and P may or may not overlap. Does NOT follow.
- Conclusion (iii): No direct connection between S and Pol. Does NOT follow.
Result: Only Conclusion (i) logically follows.

Ans 4:
(a) Article 32 of the Constitution of India provides the Right to Constitutional Remedies (Writs: Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo-Warranto). Dr. Ambedkar termed it the 'Heart and Soul' because it guarantees the practical judicial enforcement of all fundamental rights.
(b) Repo Rate is the rate at which RBI lends money to commercial banks against government securities to manage liquidity and control inflation. Reverse Repo Rate is the rate at which RBI borrows funds from commercial banks to absorb excess liquidity.

Ans 5:
(a) Total students = 1,200.
Failed in both = 10% => Passed at least one = 90%.
Using n(A ∪ B) = n(A) + n(B) - n(A ∩ B):
90% = 65% + 55% - Both%
90% = 120% - Both% => Both% = 30%.
Number of students passing both = 30% of 1,200 = 360 students.

(b) Passed ONLY Quantitative:
Percentage = 65% - 30% = 35%.
Number of students = 35% of 1,200 = 420 students.
`
  },
  {
    id: 'sample_cafinal_financial_reporting_mock',
    title: 'CA Final Paper 1: Financial Reporting (Ind AS 115, 116 & 109 Advanced Case Test)',
    journey: 'CA_FINAL',
    level: 'CA Final (ICAI New Scheme)',
    subject: 'Financial Reporting (Paper 1)',
    chapter: 'Ind AS 115: Revenue from Contracts with Customers (5-Step Framework)',
    difficulty: 'ICAI Exam Standard',
    totalMarks: 25,
    description: 'Advanced CA Final test on Ind AS 115 5-step model, Ind AS 116 ROU asset & lease schedule, and Ind AS 109 3-stage ECL framework.',
    documentContent: `=== QUESTION PAPER: CA FINAL (NEW SCHEME) - FINANCIAL REPORTING (MAX MARKS: 25) ===
SECTION A: REVENUE & LEASE ACCOUNTING (18 MARKS)
Q1. (Ind AS 115 - Variable Consideration & Step-Allocation) [10 Marks]
Apex Cloud Solutions Ltd. enters into a contract with Bharat Telecom Ltd. on 1st April 2024 to deliver a customized enterprise billing software license, 1 year of post-implementation technical support, and monthly cloud hosting for 12 months. 
The total fixed contract price agreed is ₹60,00,000. Additionally, the contract stipulates that if the billing software achieves 99.99% system uptime during the first 6 months, Apex Cloud Solutions will receive a performance bonus of ₹10,00,000. Apex estimates an 85% probability of achieving this uptime target based on its historical track record and concludes that significant reversal of revenue is highly improbable.
The standalone selling prices (SSP) of individual components if sold separately are:
- Enterprise Software License: ₹40,00,000
- 1-Year Post-Implementation Support: ₹15,00,000
- 12-Month Cloud Hosting: ₹25,00,000
Required:
(a) Determine the Total Transaction Price in accordance with Step 3 of Ind AS 115.
(b) Allocate the Total Transaction Price across the three performance obligations in accordance with Step 4.
(c) State the timing and basis of revenue recognition for each performance obligation under Step 5.

Q2. (Ind AS 116 - Lease Liability & ROU Asset Accounting) [8 Marks]
Titanium Logistics Ltd. (Lessee) enters into a 5-year lease of an industrial warehouse on 1st April 2024. Lease payments are ₹12,00,000 payable annually in arrears at the end of each financial year. Titanium incurred initial direct costs of ₹1,00,000 for legal due diligence. The lessor reimbursed ₹50,000 towards initial moving expenses. The interest rate implicit in the lease cannot be readily determined; Titanium's incremental borrowing rate is 10% per annum.
[Given: Present Value Annuity Factor at 10% for 5 years = 3.7908; PV Factor for Year 1 = 0.9091]
Required:
(a) Calculate the initial Lease Liability and Right-of-Use (ROU) Asset on 1st April 2024.
(b) Prepare the Lease Amortization Schedule for Year 1 (FY 2024-25) showing Interest Expense, Principal Repayment, and Closing Lease Liability.
(c) Calculate Depreciation on ROU Asset for FY 2024-25 assuming straight-line method over 5 years.

SECTION B: FINANCIAL INSTRUMENTS (7 MARKS)
Q3. (Ind AS 109 - 3-Stage ECL Impairment Model) [7 Marks]
Explain the 3-stage Expected Credit Loss (ECL) impairment framework under Ind AS 109 for Financial Assets measured at Amortised Cost. Detail the criteria for transition from Stage 1 to Stage 2 (Significant Increase in Credit Risk - SICR), and specify how interest revenue recognition differs between Stage 2 and Stage 3.

============================================================
=== STUDENT ANSWER SHEET: ROLL NO: FINAL-ICAI-2026-91 ===
============================================================

Answer 1:
(a) Total Transaction Price (Step 3):
Fixed contract price = ₹60,00,000.
Variable Consideration (Performance Bonus) = ₹10,00,000.
As per Ind AS 115, since there is an 85% probability and significant reversal is highly improbable, the bonus is included.
Total Transaction Price = ₹60,00,000 + ₹10,00,000 = ₹70,00,000.

(b) Standalone Selling Prices & Allocation (Step 4):
Total SSP = ₹40,00,000 + ₹15,00,000 + ₹25,00,000 = ₹80,00,000.
Proportionate allocation:
- Software License: (40 / 80) * 70,00,000 = ₹35,00,000 (50%)
- Post-Implementation Support: (15 / 80) * 70,00,000 = ₹13,12,500 (18.75%)
- Cloud Hosting: (25 / 80) * 70,00,000 = ₹21,87,500 (31.25%)
Total Allocated = ₹70,00,000.

(c) Revenue Recognition Timing (Step 5):
- Software License: Recognised at a Point in Time upon transfer of control and delivery of license key (₹35,00,000).
- Technical Support: Recognised Over Time evenly over the 12-month period as services are rendered (₹1,09,375 / month).
- Cloud Hosting: Recognised Over Time on a monthly straight-line basis over 12 months (₹1,82,291.67 / month).

Answer 2:
(a) Initial Measurement on 01-04-2024:
Initial Lease Liability = PV of Lease Payments = ₹12,00,000 * 3.7908 = ₹45,48,960.
ROU Asset = Initial Lease Liability (₹45,48,960) + Initial Direct Cost (₹1,00,000) - Lease Incentive (₹50,000) = ₹45,98,960.

(b) Lease Amortization Schedule for FY 2024-25:
- Opening Lease Liability: ₹45,48,960
- Interest Expense @ 10%: ₹4,54,896
- Lease Payment: (₹12,00,000)
- Principal Repayment: ₹12,00,000 - ₹4,54,896 = ₹7,45,104
- Closing Lease Liability (31-03-2025): ₹45,48,960 + ₹4,54,896 - ₹12,00,000 = ₹38,03,856.

(c) Depreciation on ROU Asset for FY 2024-25:
Depreciation = ₹45,98,960 / 5 years = ₹9,19,792.

Answer 3:
Ind AS 109 3-Stage Expected Credit Loss (ECL) Framework:
1. Stage 1 (Performing): Low credit risk since origination. Provision = 12-Month ECL. Interest revenue calculated on Gross Carrying Amount.
2. Stage 2 (Underperforming / SICR): Significant Increase in Credit Risk observed (e.g. 30+ days overdue, credit downgrade). Provision = Lifetime ECL. Interest revenue calculated on Gross Carrying Amount.
3. Stage 3 (Credit Impaired / Default): Default occurred (e.g. 90+ days overdue). Provision = Lifetime ECL. Key difference: Interest revenue is calculated on Net Carrying Amount (Gross Carrying Amount minus Lifetime ECL Allowance).`
  },
  {
    id: 'sample_c12_sci_physics',
    title: 'Class 12 Physics: Electrostatics & Current Electricity (CBSE Board Standard)',
    journey: 'CLASS_12_SCIENCE',
    level: 'Class 12 CBSE (Science)',
    subject: 'Physics',
    chapter: 'Electrostatics & Current Electricity',
    difficulty: 'CBSE Board Standard',
    totalMarks: 25,
    description: 'Realistic CBSE Class 12 Physics board exam covering Gauss\'s Theorem derivation, Parallel Plate Capacitor with dielectric slab, and Kirchhoff\'s Loop Law numerical with step-by-step student responses.',
    documentContent: `=== CBSE CLASS 12 PHYSICS BOARD TEST (TIME: 45 MINS | MAX MARKS: 25) ===
SECTION A: DERIVATIONS & CORE THEORETICAL PROOFS (15 MARKS)
Q1. State Gauss's Law in electrostatics. Using this law, derive an expression for the electric field intensity due to an infinitely long straight wire of uniform linear charge density λ at a distance r from it. [5 Marks]
Q2. Derive the formula for capacitance of a parallel plate capacitor having plate area A and separation d when a dielectric slab of dielectric constant K and thickness t (t < d) is inserted between the plates. [5 Marks]
Q3. State Kirchhoff's Junction Rule and Loop Rule. Explain why they are consequence of conservation of charge and conservation of energy respectively. [5 Marks]

SECTION B: NUMERICAL APPLICATION & ANALYSIS (10 MARKS)
Q4. In a potentiometer circuit... [Note: Potentiometer is deleted from CBSE syllabus].
    Alternative Q4: A battery of emf 10 V and internal resistance 3 Ω is connected to a resistor. If the current in the circuit is 0.5 A, calculate (a) resistance of the resistor, and (b) terminal voltage of the battery when the circuit is closed. [5 Marks]
Q5. Two point charges q1 = +3 μC and q2 = -3 μC are placed 20 cm apart in vacuum.
    (a) What is the electric field at the midpoint O of the line AB joining the two charges?
    (b) If a negative test charge of magnitude 1.5 × 10^-9 C is placed at this point, what is the force experienced by the test charge? [5 Marks]

============================================================
=== STUDENT ANSWER SHEET: ROLL NO: C12-SCI-2026-108 ===
============================================================

Answer 1:
Gauss's Law Statement:
The total electric flux passing through any closed Gaussian surface in vacuum is equal to 1/ε₀ times the total net charge enclosed by that closed surface:
∮ E⃗ · dA⃗ = q_enclosed / ε₀

Derivation for Infinitely Long Straight Wire:
Let a thin, infinitely long straight wire have a uniform linear charge density λ (C/m).
Consider a cylindrical Gaussian surface of radius r and length L coaxial with the line charge.
The Gaussian cylinder has 3 surfaces:
1. Top circular end cap (S1): Angle between E⃗ (radial) and area vector n̂ (upwards) is 90°.
   Flux Φ1 = ∫ E dA cos(90°) = 0
2. Bottom circular end cap (S2): Angle between E⃗ and n̂ (downwards) is 90°.
   Flux Φ2 = ∫ E dA cos(90°) = 0
3. Curved cylindrical surface (S3): Everywhere on this surface, electric field E⃗ is radial and perpendicular to the wire, parallel to dA⃗ (θ = 0°).
   Flux Φ3 = ∫ E dA cos(0°) = E ∫ dA = E * (2π r L)

Total Flux Φ_total = Φ1 + Φ2 + Φ3 = E * (2π r L)
Charge enclosed inside cylinder: q_enclosed = λ * L

According to Gauss's Law:
E * (2π r L) = (λ * L) / ε₀
E = λ / (2π ε₀ r)
Vector form: E⃗ = (λ / 2πε₀r) r̂, directed radially outward if λ > 0.

Answer 2:
Capacitance with Dielectric Slab:
Let plate area = A, initial distance between plates = d.
Initial electric field in vacuum: E₀ = σ / ε₀ = Q / (A ε₀).
When a dielectric slab of thickness t (t < d) and constant K is introduced:
- Electric field inside dielectric: E = E₀ / K
- Electric field in remaining vacuum (d - t): E₀

Total Potential Difference V between plates:
V = E₀ * (d - t) + E * t
V = E₀ * (d - t) + (E₀ / K) * t
V = E₀ [ (d - t) + t / K ]
Substituting E₀ = Q / (A ε₀):
V = [ Q / (A ε₀) ] * [ (d - t) + t/K ]

Capacitance C = Q / V:
C = Q / [ (Q / A ε₀) * ( (d - t) + t/K ) ]
C = (ε₀ A) / [ (d - t) + t/K ]
When t = d (slab fills entire space), C = K (ε₀ A / d) = K C₀.

Answer 3:
1. Kirchhoff's First Law (Junction Rule / Current Law):
   At any junction in an electrical circuit, the sum of currents entering the junction is equal to the sum of currents leaving the junction: Σ I = 0.
   Conservation Principle: This law is based on the Conservation of Electric Charge, because charge cannot accumulate or be destroyed at an ideal junction.
2. Kirchhoff's Second Law (Loop Rule / Voltage Law):
   In any closed loop of an electrical network, the algebraic sum of changes in potential (emfs and IR drops) around the loop is zero: Σ ΔV = 0 (or Σ E = Σ IR).
   Conservation Principle: This law is based on the Conservation of Energy, because the electrostatic field is conservative; moving a charge along a closed path does net zero work.

Answer 4:
Given:
Emf of battery (E) = 10 V
Internal resistance (r) = 3 Ω
Current in circuit (I) = 0.5 A

(a) Resistance of resistor (R):
Formula: I = E / (R + r)
0.5 = 10 / (R + 3)
R + 3 = 10 / 0.5 = 20
R = 20 - 3 = 17 Ω

(b) Terminal voltage (V):
Formula: V = E - I*r
V = 10 - (0.5 * 3) = 10 - 1.5 = 8.5 V
(Alternatively: V = I * R = 0.5 * 17 = 8.5 V).

Answer 5:
Given:
q1 = +3 μC = +3 × 10^-6 C (at point A)
q2 = -3 μC = -3 × 10^-6 C (at point B)
Distance AB = 20 cm = 0.20 m
Midpoint O is at distance r = 10 cm = 0.10 m from each charge.

(a) Electric field at midpoint O:
- Due to positive charge q1: Field E1 points away from A (towards B / along OB):
  E1 = (1 / 4πε₀) * (|q1| / r²) = (9 × 10^9 * 3 × 10^-6) / (0.10)²
  E1 = 27 × 10^3 / 0.01 = 2.7 × 10^6 N/C (towards B)
- Due to negative charge q2: Field E2 points towards B (along OB):
  E2 = (1 / 4πε₀) * (|q2| / r²) = 2.7 × 10^6 N/C (towards B)

Net Electric Field at O:
E_net = E1 + E2 = 2.7 × 10^6 + 2.7 × 10^6 = 5.4 × 10^6 N/C directed along line AB towards point B.

(b) Force on negative test charge q0 = -1.5 × 10^-9 C:
Formula: F⃗ = q0 * E⃗_net
Magnitude: |F| = |q0| * E_net = (1.5 × 10^-9 C) * (5.4 × 10^6 N/C) = 8.1 × 10^-3 N.
Direction: Since the test charge is negative, the force is in the direction OPPOSITE to the electric field (towards point A / along OA).`
  }
];


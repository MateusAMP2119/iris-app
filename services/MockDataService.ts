import { Article, Category, Source } from '../models';

class MockDataService {
  private static instance: MockDataService;
  private _articles: Article[] = [];
  private _categories: Category[] = [];
  private _sources: Source[] = [];

  private constructor() {
    this.initialize();
  }

  public static getInstance(): MockDataService {
    if (!MockDataService.instance) {
      MockDataService.instance = new MockDataService();
    }
    return MockDataService.instance;
  }

  private initialize() {
    // Mock Sources
    this._sources = [
      {
        id: 1,
        name: 'Tech News Daily',
        url: 'https://technewsdaily.com',
      },
      {
        id: 2,
        name: 'World Report',
        url: 'https://worldreport.com',
      },
      {
        id: 3,
        name: 'Business Insider',
        url: 'https://businessinsider.com',
      },
      {
        id: 4,
        name: 'Science Weekly',
        url: 'https://scienceweekly.com',
      },
      {
        id: 5,
        name: 'Sports Chronicle',
        url: 'https://sportschronicle.com',
      },
    ];

    // Mock Categories
    this._categories = [
      {
        id: 1,
        name: 'Technology',
        description: 'Latest in tech and innovation',
      },
      { id: 2, name: 'World', description: 'Global news and events' },
      { id: 3, name: 'Business', description: 'Business and finance news' },
      {
        id: 4,
        name: 'Science',
        description: 'Scientific discoveries and research',
      },
      { id: 5, name: 'Sports', description: 'Sports news and updates' },
      {
        id: 6,
        name: 'Politics',
        description: 'Political news and analysis',
      },
      {
        id: 7,
        name: 'Entertainment',
        description: 'Entertainment and culture',
      },
      { id: 8, name: 'Health', description: 'Health and wellness news' },
    ];

    // Mock Articles
    const now = new Date();
    this._articles = [
      {
        id: 1,
        title: 'Revolutionary AI Technology Transforms Healthcare Industry',
        content: `Artificial intelligence is reshaping the healthcare landscape in unprecedented ways. Recent developments in machine learning algorithms have enabled doctors to diagnose diseases with remarkable accuracy, often surpassing human capabilities.

The integration of AI into medical imaging has proven particularly transformative. Radiologists now work alongside intelligent systems that can detect subtle patterns in X-rays, MRIs, and CT scans that might escape the human eye. Studies show these AI-assisted diagnoses reduce error rates by up to 30%.

Beyond diagnostics, AI is revolutionizing drug discovery. Pharmaceutical companies are leveraging machine learning to identify promising drug candidates in a fraction of the time traditional methods require. What once took years can now be accomplished in months, potentially accelerating the development of life-saving treatments.

Patient care is also being enhanced through AI-powered predictive analytics. Hospitals are using these systems to forecast patient deterioration, allowing medical staff to intervene before critical situations arise. This proactive approach is saving lives and reducing healthcare costs.

Privacy concerns remain a significant challenge as healthcare organizations collect and analyze vast amounts of patient data. Regulators are working to establish frameworks that protect patient confidentiality while enabling beneficial AI applications.

The future of AI in healthcare looks promising, with ongoing research into personalized medicine, robotic surgery assistance, and mental health diagnostics. As these technologies mature, they promise to make quality healthcare more accessible and affordable for people worldwide.`,
        url: 'https://technewsdaily.com/ai-healthcare-revolution',
        sourceId: 1,
        publishedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        scrapedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
        source: this._sources[0],
        categories: [this._categories[0], this._categories[3]],
        imageUrl:
          'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
        excerpt:
          'Artificial intelligence is reshaping the healthcare landscape in unprecedented ways.',
        author: 'Dr. Sarah Chen',
      },
      {
        id: 2,
        title: 'Global Climate Summit Reaches Historic Agreement',
        content: `World leaders gathered in Geneva this week to forge a groundbreaking climate agreement that experts are calling the most significant environmental accord in decades. Representatives from 195 nations committed to ambitious carbon reduction targets and substantial financial investments in renewable energy.

The agreement establishes a framework for limiting global temperature rise to 1.5 degrees Celsius above pre-industrial levels. Each participating nation has pledged specific, measurable actions to reduce greenhouse gas emissions over the next decade.

Developed nations have committed to providing $500 billion in climate financing to help developing countries transition to clean energy and adapt to climate impacts. This unprecedented financial commitment addresses long-standing concerns about climate justice and equitable burden-sharing.

The summit also introduced innovative mechanisms for carbon trading and verification. A new international body will monitor compliance and facilitate technology transfer between nations, ensuring that progress remains transparent and accountable.

Critics note that success will depend on implementation, pointing to previous agreements that fell short of their goals. However, the presence of major emitters like China and the United States signals a genuine commitment to addressing the climate crisis.

Business leaders are responding positively, with many seeing opportunities in the green economy transition. Investment in renewable energy, electric vehicles, and sustainable infrastructure is expected to create millions of jobs globally.

Environmental advocates cautiously welcome the agreement while emphasizing the need for even more aggressive action. Time is running out to prevent the worst impacts of climate change, they warn, making swift implementation critical.`,
        url: 'https://worldreport.com/climate-summit-agreement',
        sourceId: 2,
        publishedAt: new Date(now.getTime() - 5 * 60 * 60 * 1000),
        scrapedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
        source: this._sources[1],
        categories: [this._categories[1], this._categories[5]],
        imageUrl:
          'https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=800',
        excerpt:
          'World leaders forge groundbreaking climate agreement with ambitious carbon reduction targets.',
        author: 'Michael Torres',
      },
      {
        id: 3,
        title: 'Stock Markets Surge on Economic Recovery Signs',
        content: `Financial markets rallied strongly today as fresh economic data suggests a robust recovery is underway. Major indices reached record highs, with technology and industrial sectors leading the advance.

The S&P 500 climbed 2.3%, while the Nasdaq Composite gained 3.1% and the Dow Jones Industrial Average added 450 points. Trading volume was significantly above average, indicating broad participation in the rally.

Employment figures released this morning exceeded expectations, showing 350,000 new jobs created last month. The unemployment rate dropped to its lowest level in three years, while wage growth remained steady.

Consumer confidence surveys also painted an optimistic picture, with spending intentions reaching multi-year highs. Retail sales data confirmed this trend, showing strong growth across most categories.

Corporate earnings reports have been overwhelmingly positive, with companies citing improved demand and successful cost management. Forward guidance suggests executives expect continued growth in the coming quarters.

Central bank officials indicated they see no need for policy changes, viewing current economic conditions as consistent with sustainable growth. Interest rates are expected to remain stable for the foreseeable future.

Some analysts caution that valuations are becoming stretched, particularly in technology stocks. They recommend investors maintain diversified portfolios and prepare for potential volatility.

International markets also participated in the rally, with European and Asian indices posting solid gains. Global economic coordination appears to be supporting synchronized growth across regions.`,
        url: 'https://businessinsider.com/markets-surge-recovery',
        sourceId: 3,
        publishedAt: new Date(now.getTime() - 8 * 60 * 60 * 1000),
        scrapedAt: new Date(now.getTime() - 7 * 60 * 60 * 1000),
        source: this._sources[2],
        categories: [this._categories[2]],
        imageUrl:
          'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
        excerpt:
          'Major indices reach record highs as economic data suggests robust recovery.',
        author: 'Jennifer Wu',
      },
      {
        id: 4,
        title: 'Breakthrough in Quantum Computing Promises New Era',
        content: `Scientists have achieved a major breakthrough in quantum computing that could revolutionize fields from cryptography to drug discovery. Researchers at the Advanced Computing Institute successfully demonstrated a quantum processor capable of maintaining coherence for unprecedented durations.

The new quantum system achieved what scientists call "quantum supremacy" in solving specific problems exponentially faster than classical computers. This milestone marks a turning point in the practical application of quantum technology.

Traditional computers process information in binary bits, but quantum computers use quantum bits or qubits that can exist in multiple states simultaneously. This property enables them to perform certain calculations vastly more efficiently.

The breakthrough addresses one of quantum computing's biggest challenges: maintaining quantum states long enough to perform useful calculations. Previous systems lost coherence within microseconds, but the new design sustains it for several minutes.

Potential applications are vast and transformative. Quantum computers could optimize complex logistics networks, simulate molecular interactions for drug development, and break current encryption methods while enabling new forms of secure communication.

Tech giants and startups are racing to commercialize quantum technology. Investment in the sector has surged, with analysts projecting a multi-billion dollar market within the decade.

Challenges remain, including error rates and the need for extremely cold operating temperatures. Researchers are working on error correction algorithms and exploring different quantum computing architectures.

Experts predict quantum computers won't replace classical computers but will complement them for specific applications where their unique capabilities provide advantages.`,
        url: 'https://scienceweekly.com/quantum-breakthrough',
        sourceId: 4,
        publishedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000),
        scrapedAt: new Date(now.getTime() - 11 * 60 * 60 * 1000),
        source: this._sources[3],
        categories: [this._categories[0], this._categories[3]],
        imageUrl:
          'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
        excerpt:
          'Major quantum computing breakthrough achieves unprecedented coherence durations.',
        author: 'Dr. James Park',
      },
      {
        id: 5,
        title: 'Championship Final Delivers Thrilling Overtime Victory',
        content: `In one of the most dramatic championship games in recent memory, the underdogs secured a stunning overtime victory that will be remembered for generations. The final score of 98-95 came after a nail-biting finish that kept fans on the edge of their seats.

The game featured exceptional individual performances, with the winning team's star player scoring 42 points including the decisive basket in overtime. Their remarkable shooting display included seven three-pointers and clutch free throws under pressure.

Trailing by 12 points with just five minutes remaining in regulation, the eventual champions mounted an incredible comeback. Their full-court press defense forced critical turnovers and sparked a game-changing run.

The opposing team's veteran leader played valiantly despite a minor injury, contributing 38 points and 11 assists. Their sportsmanship in defeat earned respect from players and fans alike.

Coaching decisions proved crucial, with timeouts and substitutions perfectly timed to shift momentum. The winning coach's halftime adjustments were particularly effective in neutralizing the opponent's early dominance.

Record television viewership and a sold-out arena atmosphere created an electric environment. Social media erupted with reactions as highlights circulated globally within minutes of the final buzzer.

This victory caps an extraordinary season for the champions, who overcame injuries and adversity to claim their first title in over a decade. Celebrations are expected to continue throughout the week.

The losing team, despite disappointment, can take pride in their exceptional season and the character they displayed throughout this hard-fought series.`,
        url: 'https://sportschronicle.com/championship-thriller',
        sourceId: 5,
        publishedAt: new Date(now.getTime() - 15 * 60 * 60 * 1000),
        scrapedAt: new Date(now.getTime() - 14 * 60 * 60 * 1000),
        source: this._sources[4],
        categories: [this._categories[4]],
        imageUrl:
          'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
        excerpt:
          'Underdogs secure stunning overtime victory in dramatic championship final.',
        author: 'Marcus Rodriguez',
      },
      {
        id: 6,
        title: 'New Study Reveals Benefits of Mediterranean Diet',
        content: `A comprehensive new study provides the strongest evidence yet that the Mediterranean diet significantly reduces the risk of heart disease and extends lifespan. Researchers followed 25,000 participants over 15 years, tracking their dietary habits and health outcomes.

The Mediterranean diet emphasizes fruits, vegetables, whole grains, legumes, nuts, and olive oil while limiting red meat and processed foods. Fish and poultry are consumed in moderation, and red wine is optional.

Study participants who closely followed the Mediterranean diet showed a 30% reduction in cardiovascular events compared to control groups. They also demonstrated lower rates of type 2 diabetes and certain cancers.

The diet's benefits extend beyond physical health. Cognitive function tests revealed that Mediterranean diet followers maintained better memory and mental acuity as they aged, possibly reducing dementia risk.

Researchers attribute these benefits to the diet's anti-inflammatory properties and high content of antioxidants, healthy fats, and fiber. The combination appears to support overall metabolic health and cellular function.

Unlike restrictive diets, the Mediterranean approach is sustainable long-term because it includes diverse, flavorful foods and doesn't require calorie counting. This makes adherence easier for most people.

Nutrition experts recommend gradually incorporating Mediterranean diet principles rather than making drastic overnight changes. Simple swaps like using olive oil instead of butter can be an effective starting point.

The findings have implications for public health policy, with some experts calling for dietary guidelines to more explicitly promote Mediterranean-style eating patterns.`,
        url: 'https://scienceweekly.com/mediterranean-diet-study',
        sourceId: 4,
        publishedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        scrapedAt: new Date(now.getTime() - 23 * 60 * 60 * 1000),
        source: this._sources[3],
        categories: [this._categories[7], this._categories[3]],
        imageUrl:
          'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
        excerpt:
          'Comprehensive study shows Mediterranean diet significantly reduces heart disease risk.',
        author: 'Dr. Elena Martinez',
      },
      {
        id: 7,
        title: 'Space Agency Announces Mission to Mars Colony',
        content: `The International Space Agency unveiled ambitious plans for establishing a permanent human settlement on Mars by 2040. The multi-phase project represents humanity's boldest step toward becoming a multi-planetary species.

The mission will begin with robotic precursor missions to establish infrastructure and identify the best landing sites. These automated systems will set up power generation, water extraction, and habitat modules before human arrival.

A crew of 12 astronauts will form the initial colony, selected for their technical skills, psychological resilience, and ability to work in isolated conditions. Training programs are already underway.

The journey to Mars will take approximately seven months using currently available propulsion technology. Research into faster propulsion systems continues, with the goal of reducing travel time significantly.

Life support systems capable of recycling air, water, and waste are essential for colony survival. These systems have been tested extensively on the International Space Station and will be scaled up for Mars deployment.

Growing food on Mars presents unique challenges due to the harsh environment and limited resources. Hydroponic systems using LED lighting will enable crop production inside pressurized greenhouses.

The mission faces numerous technical hurdles, including radiation exposure during transit, dust storms on Mars, and the psychological effects of isolation. Engineers and scientists are working to mitigate these risks.

Funding for the project comes from international partnerships and private sector contributions. The estimated cost of $200 billion over two decades makes it one of the most expensive scientific endeavors in history.

Despite the challenges, mission planners remain optimistic that human ingenuity and determination will prevail, opening a new chapter in human exploration.`,
        url: 'https://scienceweekly.com/mars-colony-mission',
        sourceId: 4,
        publishedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        scrapedAt: new Date(
          now.getTime() - (1 * 24 * 60 * 60 * 1000 + 23 * 60 * 60 * 1000)
        ),
        source: this._sources[3],
        categories: [this._categories[3], this._categories[0]],
        imageUrl:
          'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800',
        excerpt:
          'Space agency reveals plans for permanent Mars settlement by 2040.',
        author: 'David Kim',
      },
      {
        id: 8,
        title: 'Electric Vehicle Sales Reach Record High',
        content: `Electric vehicle adoption accelerated dramatically this quarter, with sales surpassing all previous records. Analysts attribute the surge to improved battery technology, expanded charging infrastructure, and growing environmental awareness.

Automakers sold over 2 million electric vehicles globally in the past three months, representing a 65% increase year-over-year. Market share for EVs now exceeds 15% in several countries.

Battery costs have fallen significantly, making electric vehicles price-competitive with traditional gasoline cars. Some models now cost less to own over their lifetime when factoring in fuel and maintenance savings.

Charging infrastructure continues expanding rapidly, with public charging stations doubling in number over the past year. Fast-charging technology enables 80% battery replenishment in under 30 minutes.

Government incentives play a crucial role in adoption, with tax credits and rebates reducing purchase prices substantially. Several countries have announced plans to ban new gasoline vehicle sales within the next 15 years.

Traditional automakers are pivoting aggressively toward electric vehicles, investing billions in battery factories and EV platform development. Industry analysts predict EVs will dominate new car sales by 2035.

Environmental benefits are significant, with each electric vehicle preventing approximately 4 tons of carbon emissions annually compared to gasoline equivalents. This impact multiplies as electricity grids incorporate more renewable energy.

Challenges remain, including raw material supply for batteries and the need for grid infrastructure upgrades. However, technological progress and policy support suggest these obstacles will be overcome.

Consumer attitudes are shifting, with surveys showing increasing preference for electric vehicles among car buyers of all ages.`,
        url: 'https://businessinsider.com/ev-sales-record',
        sourceId: 3,
        publishedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        scrapedAt: new Date(
          now.getTime() - (2 * 24 * 60 * 60 * 1000 + 22 * 60 * 60 * 1000)
        ),
        source: this._sources[2],
        categories: [this._categories[2], this._categories[0]],
        imageUrl:
          'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800',
        excerpt:
          'Electric vehicle sales surge 65% year-over-year, reaching unprecedented levels.',
        author: 'Rebecca Foster',
      },
    ];
  }

  get articles(): Article[] {
    return this._articles;
  }

  get categories(): Category[] {
    return this._categories;
  }

  get sources(): Source[] {
    return this._sources;
  }

  getArticlesByCategory(categoryId: number): Article[] {
    return this._articles.filter((article) =>
      article.categories?.some((cat) => cat.id === categoryId)
    );
  }

  getArticleById(id: number): Article | undefined {
    return this._articles.find((article) => article.id === id);
  }

  getFeaturedArticles(): Article[] {
    return this._articles.slice(0, 3);
  }

  getRecentArticles(): Article[] {
    return [...this._articles].sort(
      (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
    );
  }
}

export default MockDataService.getInstance();

import { useLang } from "../LanguageContext";

const ABOUT = {
  en: {
    eyebrow: "About The Project",
    title: "Smart Agriculture Advisory System",
    desc: "This graduate project is a MERN-based decision support system that helps farmers choose suitable crops and access agricultural advice using farm conditions such as soil type, season, rainfall, temperature, and irrigation availability.",
    problem: "Problem",
    problemDesc: "Many farmers lack timely digital guidance when choosing crops, identifying pests, or planning production based on seasonal and soil conditions.",
    objective: "Objective",
    objectiveDesc: "To build a web system that provides crop recommendations, farmer profile management, crop information, pest advisory, and recommendation history.",
    tech: "Technology",
    techDesc: "React handles the frontend, Node.js and Express provide APIs, and MongoDB stores users, farm profiles, crop records, and recommendations.",
  },
  am: {
    eyebrow: "ስለ ፕሮጀክቱ",
    title: "ዘመናዊ የግብርና አማካሪ ስርዓት",
    desc: "ይህ የምረቃ ፕሮጀክት MERN-ላይ የተመሰረተ የውሳኔ ድጋፍ ስርዓት ሲሆን ገበሬዎች ተስማሚ ሰብሎችን ለመምረጥ እና የአፈር አይነት፣ ወቅት፣ ዝናብ፣ ሙቀት እና የመስኖ ተደራሽነት ሁኔታዎችን በመጠቀም የግብርና ምክር ለማግኘት ይረዳቸዋል።",
    problem: "ችግር",
    problemDesc: "ብዙ ገበሬዎች ሰብሎችን ሲመርጡ፣ ተባዮችን ሲለዩ ወይም በወቅታዊ እና የአፈር ሁኔታዎች ላይ ተመስርተው ምርት ሲያቅዱ ወቅታዊ ዲጂታል መመሪያ ያጣሉ።",
    objective: "ዓላማ",
    objectiveDesc: "የሰብል ምክሮችን፣ የገበሬ መገለጫ አስተዳደርን፣ የሰብል መረጃን፣ የተባይ አማካሪን እና የምክር ታሪክን የሚሰጥ የድር ስርዓት ለመገንባት።",
    tech: "ቴክኖሎጂ",
    techDesc: "React ፊት-ለፊቱን ያስተናግዳል፣ Node.js እና Express APIዎችን ይሰጣሉ፣ MongoDB ደግሞ ተጠቃሚዎችን፣ የእርሻ መገለጫዎችን፣ የሰብል መዝገቦችን እና ምክሮችን ያከማቻል።",
  },
  om: {
    eyebrow: "Waa'ee Pirojektii",
    title: "Sirna Gorsaa Qonnaa Ammayyaa",
    desc: "Pirojektiin eebbifamuu kun sirna deeggarsa murteessuu MERN irratti hundaa'e yoo ta'u, qonnaan bultootni midhaan mijataa filachuuf fi gosa lafa, yeroo, rooba, ho'a fi argamummaa jallisii fayyadamuun gorsa qonnaa argachuuf gargaara.",
    problem: "Rakkoo",
    problemDesc: "Qonnaan bultoonni hedduun yeroo midhaan filatan, dhukkuba adda baasan ykn haala yeroo fi lafaa irratti hundaa'uun oomisha karoorfatan qajeelfama dijitaalaa yeroo sirrii argachuu hin danda'an.",
    objective: "Kaayyoo",
    objectiveDesc: "Gorsa midhaan, bulchiinsa profaayilii qonnaan bulaa, odeeffannoo midhaan, gorsa dhukkuba fi seenaa gorsa kan kennuu danda'u sirna marsariitii ijaaruu.",
    tech: "Teeknooloojii",
    techDesc: "React fuula duraa bulcha, Node.js fi Express API kenna, MongoDB ammoo fayyadamtoota, profaayilii qonnaa, galmee midhaan fi gorsa kuusa.",
  },
};

function AboutPage() {
  const { lang } = useLang();
  const A = ABOUT[lang] || ABOUT.en;

  return (
    <section className="about-page">
      <div className="panel about-hero">
        <p className="eyebrow">{A.eyebrow}</p>
        <h2>{A.title}</h2>
        <p>{A.desc}</p>
      </div>
      <div className="about-grid">
        <article className="panel"><h3>{A.problem}</h3><p>{A.problemDesc}</p></article>
        <article className="panel"><h3>{A.objective}</h3><p>{A.objectiveDesc}</p></article>
        <article className="panel"><h3>{A.tech}</h3><p>{A.techDesc}</p></article>
      </div>
    </section>
  );
}

export default AboutPage;

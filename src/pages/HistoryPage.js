import { useLang } from "../LanguageContext";

function HistoryPage({ history }) {
  const { t } = useLang();
  return (
    <section className="panel">
      <h2>{t("history")}</h2>
      <div className="list-grid">
        {history.length === 0 && <p>{t("noHistory")}</p>}
        {history.map((item) => (
          <article className="record" key={item._id}>
            <strong>{item.recommendedCrops.join(", ")}</strong>
            <p>{item.soilType} {t("soil")}, {item.season} {t("season")}, {item.location || "-"}</p>
            <small>{new Date(item.createdAt).toLocaleString()}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

export default HistoryPage;

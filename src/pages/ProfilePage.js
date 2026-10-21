import SelectField from "../components/SelectField";
import { soilOptions } from "../constants";
import { useLang } from "../LanguageContext";

function ProfilePage({ profile, onProfileChange, onSubmit }) {
  const { t } = useLang();
  return (
    <section className="panel">
      <h2>{t("profile")}</h2>
      <form onSubmit={onSubmit} className="form-grid">
        <label>
          {t("location")}
          <input value={profile.location} onChange={(e) => onProfileChange({ ...profile, location: e.target.value })} />
        </label>
        <label>
          {t("farmSizeLabel")}
          <input value={profile.farmSize} onChange={(e) => onProfileChange({ ...profile, farmSize: e.target.value })} placeholder="e.g. 2 hectares" />
        </label>
        <SelectField label={t("soilType")} value={profile.soilType} onChange={(v) => onProfileChange({ ...profile, soilType: v })} options={soilOptions} />
        <label>
          {t("preferredCrops")}
          <input value={profile.preferredCrops} onChange={(e) => onProfileChange({ ...profile, preferredCrops: e.target.value })} />
        </label>
        <label className="checkbox-label">
          <input type="checkbox" checked={profile.irrigationAvailable} onChange={(e) => onProfileChange({ ...profile, irrigationAvailable: e.target.checked })} />
          {t("irrigationAvailable")}
        </label>
        <button type="submit">{t("saveProfile")}</button>
      </form>
    </section>
  );
}

export default ProfilePage;

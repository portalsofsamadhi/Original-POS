import {
  NOTE_ON_FIT_CONTENT,
  RELATED_CREATIVE_SERVICES_CONTENT,
} from "../../data/noteOnFitContent";

const NoteOnFitPanel = () => (
  <div className="samadhi-prod-fit-panel">
    <div className="samadhi-prod-fit-panel__columns">
      <div className="samadhi-prod-fit-panel__note">
        <h3 className="samadhi-prod-fit-panel__heading">{NOTE_ON_FIT_CONTENT.title}</h3>
        <p className="samadhi-prod-fit-panel__positive">{NOTE_ON_FIT_CONTENT.positive}</p>
        <p className="samadhi-prod-fit-panel__caveat">{NOTE_ON_FIT_CONTENT.caveat}</p>
      </div>
      <div className="samadhi-prod-fit-panel__services">
        <h3 className="samadhi-prod-fit-panel__heading">
          {RELATED_CREATIVE_SERVICES_CONTENT.title}
        </h3>
        <p className="samadhi-prod-fit-panel__services-intro">
          {RELATED_CREATIVE_SERVICES_CONTENT.intro}
        </p>
        <ul className="samadhi-prod-fit-panel__list">
          {RELATED_CREATIVE_SERVICES_CONTENT.services.map((service) => (
            <li key={service}>{service}</li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export default NoteOnFitPanel;
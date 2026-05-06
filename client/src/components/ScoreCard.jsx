const ScoreCard = ({ result }) => {
  if (!result) return null;

  return (
    <div className="card">
      <h3>{result.candidateName}</h3>
      <div className="score-circle">{Math.round(result.score)}%</div>

      <div className="grid-two">
        <div>
          <h4>Extracted Skills</h4>
          <div className="tags">
            {result.extractedSkills?.map((skill, idx) => (
              <span key={idx} className="tag">{skill}</span>
            ))}
          </div>
        </div>

        <div>
          <h4>Matched Skills</h4>
          <div className="tags">
            {result.matchedSkills?.map((skill, idx) => (
              <span key={idx} className="tag success">{skill}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-20">
        <h4>Missing Skills</h4>
        <div className="tags">
          {result.missingSkills?.length ? (
            result.missingSkills.map((skill, idx) => (
              <span key={idx} className="tag danger">{skill}</span>
            ))
          ) : (
            <span>No major missing skills found</span>
          )}
        </div>
      </div>

      <div className="mt-20">
        <h4>Suggestions</h4>
        <ul>
          {result.suggestions?.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ScoreCard;
from flask import Flask, request, jsonify
from flask_cors import CORS
import pdfplumber
import re
import os
from collections import Counter
from sentence_transformers import SentenceTransformer, util
from skill_data import SKILLS_DB

app = Flask(__name__)
CORS(app)

model = SentenceTransformer("all-MiniLM-L6-v2")

def clean_text(text):
    text = text.lower()
    text = re.sub(r"[^a-zA-Z0-9+#.\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

def extract_text_from_pdf(file_path):
    full_text = []
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text() or ""
            full_text.append(text)
    return "\n".join(full_text)

def extract_candidate_name(text):
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    if lines:
        first_line = lines[0]
        if len(first_line.split()) <= 5:
            return first_line.title()
    return "Unknown Candidate"

def extract_skills(text):
    text_lower = clean_text(text)
    found = set()
    for skill in SKILLS_DB:
        if skill.lower() in text_lower:
            found.add(skill)
    return sorted(found)

def semantic_match_score(resume_text, jd_text):
    embeddings = model.encode([resume_text, jd_text], convert_to_tensor=True)
    similarity = util.cos_sim(embeddings[0], embeddings[1]).item()
    return round(similarity * 100, 2)

def keyword_match(resume_skills, jd_text):
    jd_clean = clean_text(jd_text)
    jd_skills = []
    for skill in SKILLS_DB:
        if skill.lower() in jd_clean:
            jd_skills.append(skill)

    resume_set = set([s.lower() for s in resume_skills])
    jd_set = set([s.lower() for s in jd_skills])

    matched = sorted(list(resume_set.intersection(jd_set)))
    missing = sorted(list(jd_set.difference(resume_set)))

    return matched, missing, sorted(jd_set)

def generate_suggestions(score, missing_skills, resume_text):
    suggestions = []

    if score < 50:
        suggestions.append("Resume relevance is low. Tailor the resume specifically to the job description.")
    elif score < 70:
        suggestions.append("Resume is moderately aligned. Add more job-specific keywords and measurable achievements.")
    else:
        suggestions.append("Resume has a strong match. Improve formatting and quantify impact for better results.")

    if missing_skills:
        suggestions.append(f"Add missing skills if you have them: {', '.join(missing_skills[:8])}.")

    if "project" not in resume_text.lower():
        suggestions.append("Include a projects section with technologies and measurable outcomes.")

    if "experience" not in resume_text.lower():
        suggestions.append("Add clear work experience headings and role responsibilities.")

    if len(resume_text.split()) < 250:
        suggestions.append("Resume content looks short. Add more detail on achievements, tools, and impact.")

    return suggestions

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "AI Resume Analyzer Flask service running"})

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    file_path = data.get("filePath")
    file_name = data.get("fileName")
    job_description = data.get("jobDescription", "")

    if not file_path or not os.path.exists(file_path):
        return jsonify({"message": "Resume file not found"}), 400

    resume_text = extract_text_from_pdf(file_path)
    candidate_name = extract_candidate_name(resume_text)
    extracted_skills = extract_skills(resume_text)
    matched_skills, missing_skills, jd_skills = keyword_match(extracted_skills, job_description)
    score = semantic_match_score(clean_text(resume_text), clean_text(job_description))
    suggestions = generate_suggestions(score, missing_skills, resume_text)

    analytics = {
        "skillMatchPercent": round((len(matched_skills) / len(jd_skills)) * 100, 2) if jd_skills else 0,
        "resumeWordCount": len(resume_text.split()),
        "jdWordCount": len(job_description.split()),
        "matchedSkillsCount": len(matched_skills),
        "missingSkillsCount": len(missing_skills)
    }

    return jsonify({
        "candidateName": candidate_name,
        "fileName": file_name,
        "resumeText": resume_text,
        "extractedSkills": extracted_skills,
        "matchedSkills": matched_skills,
        "missingSkills": missing_skills,
        "score": score,
        "suggestions": suggestions,
        "analytics": analytics
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
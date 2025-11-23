from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import joblib
import datetime
import re 
import requests 
import numpy as np
from collections import defaultdict, Counter
from datetime import date, timedelta

app = Flask(__name__)
CORS(app)

# --- DATABASE CONNECTION ---
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:mysql55@localhost/emotix_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# --- DATABASE MODELS ---
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

class Entry(db.Model):
    __tablename__ = 'entries'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    text = db.Column(db.Text, nullable=False)
    vibe = db.Column(db.String(50), nullable=False)
    color = db.Column(db.String(20), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)

# --- MODEL LOADING ---
print("🔄 Loading model and vectorizer...")
svm_model = joblib.load('svm_model_new.pkl')
vectorizer = joblib.load('vectorizer_new.pkl')
print("✅ Model and vectorizer loaded successfully.")

# --- EMOTION MAPS ---
EMOTION_MAP = {
    0: 'Sad',
    1: 'Joyful', 
    2: 'Love',
    3: 'Anger',
    4: 'Fear',
    5: 'Surprise',
    6: 'Neutral'
}

COLOR_MAP = {
    'Sad': '#60a5fa',
    'Joyful': '#facc15',
    'Love': '#f472b6',
    'Anger': '#f87171',
    'Fear': '#a78bfa',
    'Surprise': '#22d3ee',
    'Neutral': '#9ca3af'
}

# --- MUSIC QUERIES ---
EMOTION_TO_MUSIC_QUERY = {
    'Sad': {
        'title': 'You seem to be feeling Sad',
        'query1_text': 'Help me feel better',
        'query1_search': 'malayalam uplifting songs',
        'query2_text': 'Let me reflect',
        'query2_search': 'malayalam calm sad songs'
    },
    'Joyful': {
        'title': 'You seem to be feeling Joyful!',
        'query1_text': 'Keep the vibe going!',
        'query1_search': 'malayalam happy songs playlist',
        'query2_text': 'Share the joy',
        'query2_search': 'malayalam celebration songs'
    },
    'Love': {
        'title': 'You seem to be feeling Love',
        'query1_text': 'Romantic Mood',
        'query1_search': 'malayalam romantic songs',
        'query2_text': 'Love Melodies',
        'query2_search': 'malayalam love melodies'
    },
    'Anger': {
        'title': 'You seem to be feeling Angry',
        'query1_text': 'Help me calm down',
        'query1_search': 'malayalam calm relaxing music',
        'query2_text': 'Match my energy',
        'query2_search': 'malayalam energetic rock'
    },
    'Fear': {
        'title': 'You seem to be feeling Fearful',
        'query1_text': 'Soothe my mind',
        'query1_search': 'malayalam peaceful meditation music',
        'query2_text': 'Be strong',
        'query2_search': 'malayalam motivational songs'
    },
    'Surprise': {
        'title': 'You seem Surprised!',
        'query1_text': 'Fun & Surprising',
        'query1_search': 'malayalam party songs',
        'query2_text': 'Wow Factor',
        'query2_search': 'malayalam trending hits'
    },
    'Neutral': {
        'title': 'Feeling neutral?',
        'query1_text': 'Discover new music',
        'query1_search': 'malayalam new hits',
        'query2_text': 'Popular melodies',
        'query2_search': 'malayalam popular songs'
    }
}

# --- IMPROVED RULE-BASED SYSTEM ---
CONFIDENCE_THRESHOLD = 0.4  # Lowered for better detection

NEGATION_WORDS = [
    'not', 'no', 'never', "n't", "didn't", "wasn't", "isn't", "aren't", 
    "haven't", "hasn't", "don't", "doesn't", "can't", "couldn't", "won't"
]

NEGATION_RULE = { 1: 0, 2: 0 }  # Flip Joyful(1) or Love(2) to Sad(0)

# Expanded keyword lists
SAD_WORDS = [
    'tired', 'exhausted', 'drained', 'worn out', 'depressed', 'unhappy',
    'sad', 'lonely', 'miserable', 'hopeless', 'disappointed', 'upset',
    'down', 'low', 'blue', 'gloomy', 'sorrowful'
]

FEAR_WORDS = [
    'ghost', 'scared', 'afraid', 'spooky', 'haunted', 'horror',
    'fear', 'feared', 'fearful', 'terrified', 'frightened', 'anxious',
    'worried', 'nervous', 'panic', 'panicked', 'dread', 'dreading',
    'threatened', 'intimidated', 'alarmed', 'uneasy', 'tense',
    'scary', 'creepy', 'phobia'
]

ANGER_WORDS = [
    'angry', 'mad', 'furious', 'annoyed', 'irritated', 'frustrated',
    'rage', 'outraged', 'pissed', 'hate', 'hating', 'enraged',
    'livid', 'infuriated', 'aggravated', 'bitter'
]

JOY_WORDS = [
    'happy', 'joyful', 'excited', 'thrilled', 'delighted', 'cheerful',
    'glad', 'pleased', 'wonderful', 'amazing', 'awesome', 'great',
    'fantastic', 'excellent', 'blessed', 'grateful'
]


# --- API ENDPOINTS ---
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 409
    hashed_password = generate_password_hash(password)
    new_user = User(username=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    print(f"Registered new user: {username}")
    return jsonify({'message': 'Signup successful'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password, password):
        print(f"User '{username}' logged in.")
        return jsonify({'message': 'Login successful', 'username': username}), 200
    else:
        return jsonify({'error': 'Invalid username or password'}), 401

@app.route('/analyze-and-save', methods=['POST'])
def analyze_and_save():
    data = request.get_json()
    text = data.get('text')
    username = data.get('username')
    timestamp_str = data.get('timestamp')
    
    emotion_votes = []
    sentences = re.split(r'[.!?\n]+', text)
    sentences = [s.strip() for s in sentences if s.strip()]

    if not sentences:
        return jsonify({'overallVibe': {'vibe': 'Neutral', 'color': COLOR_MAP['Neutral']}, 'suggestion': None})

    for sentence in sentences:
        text_vector = vectorizer.transform([sentence])
        scores = svm_model.decision_function(text_vector)[0]
        base_prediction = int(np.argmax(scores))
        max_score = np.max(scores)
        final_prediction = base_prediction
        
        # Clean text for keyword matching
        cleaned_text_for_check = re.sub(r'[^\w\s]', '', sentence.lower())
        words = set(cleaned_text_for_check.split())
        
        # Check for emotion-specific keywords
        fear_keyword_detected = any(word in FEAR_WORDS for word in words)
        anger_keyword_detected = any(word in ANGER_WORDS for word in words)
        sad_keyword_detected = any(word in SAD_WORDS for word in words)
        joy_keyword_detected = any(word in JOY_WORDS for word in words)
        negation_detected = any(word in NEGATION_WORDS for word in words)
        
        # Apply rules with priority: Fear > Anger > Sad > Joy
        if fear_keyword_detected:
            final_prediction = 4  # Force Fear
        elif anger_keyword_detected and final_prediction != 3:
            final_prediction = 3  # Force Anger
        elif sad_keyword_detected and final_prediction not in [3, 4]:
            final_prediction = 0  # Force Sad
        elif joy_keyword_detected and not negation_detected:
            final_prediction = 1  # Force Joyful
        elif negation_detected and base_prediction in NEGATION_RULE and max_score > 0.3:
            final_prediction = NEGATION_RULE[base_prediction]
        elif max_score < CONFIDENCE_THRESHOLD and not (fear_keyword_detected or anger_keyword_detected or sad_keyword_detected):
            final_prediction = 6  # Neutral only if truly uncertain AND no strong keywords
        
        emotion_votes.append(final_prediction)
    
    # Majority vote with smarter Neutral handling
    non_neutral_votes = [v for v in emotion_votes if v != 6]
    if non_neutral_votes:
        final_prediction = Counter(non_neutral_votes).most_common(1)[0][0]
    else:
        final_prediction = 6  # Neutral only if all votes are weak

    vibe = EMOTION_MAP.get(final_prediction, 'Neutral')
    color = COLOR_MAP.get(vibe, '#9ca3af')
    
    new_entry = Entry(
        username=username, text=text, vibe=vibe, color=color,
        timestamp=datetime.datetime.fromisoformat(timestamp_str.replace('Z', ''))
    )
    db.session.add(new_entry)
    db.session.commit()
    print(f"Saved entry for user '{username}' with vibe: {vibe}")
    
    suggestion_data = EMOTION_TO_MUSIC_QUERY.get(vibe) if vibe != 'Neutral' else None

    return jsonify({
        'overallVibe': {'vibe': vibe, 'color': color},
        'suggestion': suggestion_data 
    })

@app.route('/entries/<username>', methods=['GET'])
def get_entries(username):
    entries = Entry.query.filter_by(username=username).order_by(Entry.timestamp.desc()).all()
    result = [{
        '_id': entry.id, 'text': entry.text, 'vibe': entry.vibe, 'color': entry.color,
        'timestamp': entry.timestamp.isoformat() + 'Z'
    } for entry in entries]
    return jsonify(result)

@app.route('/mood-data/<username>', methods=['GET'])
def get_mood_data(username):
    try:
        entries = Entry.query.filter_by(username=username).order_by(Entry.timestamp.asc()).all()
        daily_vibes = defaultdict(list)
        for entry in entries:
            entry_date = entry.timestamp.date()
            daily_vibes[entry_date].append(entry.vibe)

        moods = {}
        for day, vibes in daily_vibes.items():
            most_common_vibe = Counter(vibes).most_common(1)[0][0]
            moods[day.isoformat()] = most_common_vibe

        wellness_alert = False
        negative_moods = {'Sad', 'Anger', 'Fear'}
        
        if not moods:
             return jsonify({'moods': {}, 'wellness_alert': False}), 200

        sorted_dates = sorted(moods.keys())
        start_date = date.fromisoformat(sorted_dates[0])
        end_date = date.fromisoformat(sorted_dates[-1])
        if date.fromisoformat(sorted_dates[-1]) == date.today():
             end_date = date.today()
        
        day_count = (end_date - start_date).days + 1
        streak = 0
        for single_date in (start_date + timedelta(n) for n in range(day_count)):
            day_iso = single_date.isoformat()
            if day_iso in moods and moods[day_iso] in negative_moods:
                streak += 1
            else:
                streak = 0
            if streak >= 3:
                wellness_alert = True
                break

        return jsonify({'moods': moods, 'wellness_alert': wellness_alert}), 200

    except Exception as e:
        print(f"Error in /mood-data: {e}")
        return jsonify({'error': 'Failed to process mood data'}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all() 
    app.run(port=5000, debug=True)
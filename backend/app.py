from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from data_processor import DataProcessor
from model import DiagnosisModel

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

data_processor = DataProcessor('../fixed_augmented_dataset_multibiner_num_augmentations_100_cleaned.csv')
data_processor.load_data()

print("\nAvailable symptoms:")
for symptom in data_processor.get_unique_symptoms():
    print(f"- {symptom}")
print("\n")

model = DiagnosisModel()

if not os.path.exists('model.joblib'):
    print("Training new model...")
    model.train(
        data_processor.X_train,
        data_processor.y_train
    )
    model.evaluate(data_processor.X_test, data_processor.y_test)
    model.save_model('model.joblib')
    print("Model training completed!")
else:
    print("Loading existing model...")
    model.load_model('model.joblib')
    model.evaluate(data_processor.X_test, data_processor.y_test)
    print("Model loaded successfully!")

@app.route('/')
def index():
    """Root route"""
    return jsonify({
        'status': 'ok',
        'message': 'Symptom Diagnosis API is running'
    })

@app.route('/api/symptoms', methods=['GET'])
def get_symptoms():
    """Get list of available symptoms"""
    return jsonify(data_processor.get_unique_symptoms())

@app.route('/api/diagnose', methods=['POST'])
def diagnose():
    """Get diagnosis based on symptoms"""
    data = request.json
    symptoms = data.get('symptoms', [])
    
    if not symptoms:
        return jsonify({'error': 'No symptoms provided'}), 400
    
    try:
        print(f"Received symptoms: {symptoms}")
        encoded_symptoms = data_processor.encode_symptoms(symptoms)
        print(f"Encoded symptoms shape: {encoded_symptoms.shape}")
        
        encoded_symptoms = encoded_symptoms.reshape(1, -1)
        print(f"Reshaped symptoms shape: {encoded_symptoms.shape}")
        
        prediction = model.predict(encoded_symptoms)
        
        diagnosis = data_processor.decode_diagnosis(prediction)[0]
        
        return jsonify({
            'diagnosis': diagnosis,
            'symptoms': symptoms
        })
    except Exception as e:
        print(f"Error in diagnose endpoint: {str(e)}")
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5001) 
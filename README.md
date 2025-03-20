# Symptom-Diagnosis

An interactive chatbot that provides medical diagnosis suggestions based on user-reported symptoms using deep learning.

## Features

- Interactive chat interface
- Real-time symptom analysis
- Deep learning-based diagnosis prediction
- Modern and responsive UI
- Multi-symptom support

## Project Structure

```
SymptomDiagnosis/
├── backend/
│   ├── app.py
│   ├── model.py
│   └── data_processor.py
├── frontend/
│   ├── public/
│   └── src/
├── requirements.txt
└── README.md
```

## Setup Instructions

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Start the backend server:
```bash
cd backend
python app.py
```

4. Start the frontend development server:
```bash
cd frontend
npm install
npm start
```

5. Open http://localhost:3000 in your browser

## Technologies Used

- Backend: Python, Flask, TensorFlow
- Frontend: React, Material-UI
- Machine Learning: Deep Neural Network
- Data Processing: Pandas, NumPy 

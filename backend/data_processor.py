import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split

class DataProcessor:
    def __init__(self, data_path):
        self.data_path = data_path
        self.df = None
        self.symptom_encoder = LabelEncoder()
        self.diagnosis_encoder = LabelEncoder()
        self.X = None
        self.y = None
        self.X_train = None
        self.X_test = None
        self.y_train = None
        self.y_test = None
        self.unique_symptoms = None
        self.symptom_to_index = None

    def load_data(self):
        """Load and preprocess the dataset"""
        self.df = pd.read_csv(self.data_path)
        
        symptom_columns = self.df.columns[:-1]
        self.unique_symptoms = symptom_columns.tolist()
        self.symptom_to_index = {symptom: idx for idx, symptom in enumerate(self.unique_symptoms)}
        
        self.X = self.df[symptom_columns].values
        
        diagnosis_column = self.df.columns[-1]
        self.y = self.diagnosis_encoder.fit_transform(self.df[diagnosis_column])
        
        self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(
            self.X, self.y, test_size=0.2, random_state=42
        )

    def get_unique_symptoms(self):
        """Get list of unique symptoms"""
        return self.unique_symptoms

    def get_unique_diagnoses(self):
        """Get list of unique diagnoses"""
        return self.diagnosis_encoder.classes_.tolist()

    def encode_symptoms(self, symptoms):
        """Encode new symptoms for prediction"""
        if not symptoms:
            raise ValueError("No symptoms provided")
            
        encoded = np.zeros(len(self.unique_symptoms))
        
        print(f"Processing symptoms: {symptoms}")
        print(f"Number of unique symptoms: {len(self.unique_symptoms)}")
        
        for symptom in symptoms:
            if symptom in self.symptom_to_index:
                idx = self.symptom_to_index[symptom]
                encoded[idx] = 1
                print(f"Encoded symptom '{symptom}' at index {idx}")
            else:
                print(f"Warning: Symptom '{symptom}' not found in symptom dictionary")
        
        return encoded

    def decode_diagnosis(self, encoded_diagnosis):
        """Decode the predicted diagnosis"""
        return self.diagnosis_encoder.inverse_transform(encoded_diagnosis) 
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib
import numpy as np

class DiagnosisModel:
    def __init__(self):
        self.model = RandomForestClassifier(
            n_estimators=200,
            max_depth=20,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42
        )
        
    def train(self, X_train, y_train):
        """Train the model"""
        print(f"Training model with input shape: {X_train.shape}")
        print(f"Number of features: {X_train.shape[1]}")
        self.model.fit(X_train, y_train)
        train_score = self.model.score(X_train, y_train)
        print(f"Training accuracy: {train_score:.4f}")
        return train_score
    
    def evaluate(self, X_test, y_test):
        """Evaluate model performance on test data"""
        y_pred = self.model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        print("\nModel Evaluation:")
        print(f"Test Accuracy: {accuracy:.4f}")
        print("\nDetailed Classification Report:")
        print(classification_report(y_test, y_pred))
        return accuracy
    
    def predict(self, symptoms):
        """Make predictions on new symptoms"""
        print(f"Making prediction with input shape: {symptoms.shape}")
        print(f"Number of features: {symptoms.shape[1]}")
        return self.model.predict(symptoms)
    
    def save_model(self, path):
        """Save the trained model"""
        joblib.dump(self.model, path)
        print(f"Model saved with {len(self.model.feature_importances_)} features")
    
    def load_model(self, path):
        """Load a trained model"""
        self.model = joblib.load(path)
        print(f"Loaded model with {len(self.model.feature_importances_)} features") 
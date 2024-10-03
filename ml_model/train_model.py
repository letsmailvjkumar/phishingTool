import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

# Load the dataset
df = pd.read_csv('./urldata.csv', encoding='utf-8')  # Replace with your actual file name

print("Columns in the dataset:", df.columns)

# If all columns are read as a single column, split them
if len(df.columns) == 1:
    df = df[df.columns[0]].str.split(',', expand=True)
    df.columns = ['Domain', 'Have_IP', 'Have_At', 'URL_Length', 'URL_Depth', 'Redirection', 
                  'https_Domain', 'TinyURL', 'Prefix/Suffix', 'DNS_Record', 'Web_Traffic', 
                  'Domain_Age', 'Domain_End', 'iFrame', 'Mouse_Over', 'Right_Click', 
                  'Web_Forwards', 'Label']

print("Columns after processing:", df.columns)

# Prepare features and target
X = df.drop(['Domain', 'Label'], axis=1)
y = df['Label']

# Convert all feature columns to numeric
X = X.apply(pd.to_numeric, errors='coerce')
y = y.astype(int)

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the model
model = RandomForestClassifier(random_state=42)
model.fit(X_train, y_train)

# Save the model
joblib.dump(model, 'phishing_detection_model.pkl')

print("Model trained and saved as 'phishing_detection_model.pkl'")

# Optional: Print model accuracy
from sklearn.metrics import accuracy_score
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Model accuracy: {accuracy:.2f}")
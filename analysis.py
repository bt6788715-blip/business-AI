import pandas as pd
import matplotlib.pyplot as plt

# Load the dataset
df = pd.read_csv("employee_data.csv")

# Display the first 5 rows
print("First 5 Rows:")
print(df.head())

# Dataset information
print("\nDataset Info:")
print(df.info())

# Statistical summary
print("\nStatistical Summary:")
print(df.describe())

# Display column names
print("\nColumns in Dataset:")
print(df.columns)

# -----------------------------
# Calculate average of Salary
# -----------------------------
if 'Salary' in df.columns:
    avg_salary = df['Salary'].mean()
    print("\nAverage Salary:", avg_salary)
else:
    print("\n'Salary' column not found.")

# -----------------------------
# Bar Chart
# Average Salary by Department
# -----------------------------
if 'Department' in df.columns and 'Salary' in df.columns:
    dept_salary = df.groupby('Department')['Salary'].mean()

    plt.figure(figsize=(8,5))
    plt.bar(dept_salary.index, dept_salary.values)
    plt.title("Average Salary by Department")
    plt.xlabel("Department")
    plt.ylabel("Average Salary")
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.show()

# -----------------------------
# Scatter Plot
# Age vs Salary
# -----------------------------
if 'Age' in df.columns and 'Salary' in df.columns:
    plt.figure(figsize=(8,5))
    plt.scatter(df['Age'], df['Salary'])
    plt.title("Age vs Salary")
    plt.xlabel("Age")
    plt.ylabel("Salary")
    plt.tight_layout()
    plt.show()

# -----------------------------
# Heatmap (Matplotlib)
# -----------------------------
corr = df.corr(numeric_only=True)

plt.figure(figsize=(8,6))
plt.imshow(corr, cmap='coolwarm', interpolation='nearest')
plt.colorbar()

plt.xticks(range(len(corr.columns)), corr.columns, rotation=90)
plt.yticks(range(len(corr.columns)), corr.columns)

plt.title("Correlation Heatmap")
plt.tight_layout()
plt.show()
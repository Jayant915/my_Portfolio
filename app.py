from flask import Flask, render_template, request, redirect, url_for
from flask_mail import Mail, Message
import os
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

app = Flask(__name__)

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False

# --- Securely load credentials from the environment (from your .env file) ---
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_USERNAME')

mail = Mail(app)

# --- Standard Flask Routes ---

@app.route('/')
def index():
    # Renders your main HTML template (e.g., index.html)
    return render_template('index.html') 

# The form will submit to this endpoint
@app.route('/contact', methods=['POST'])
def handle_contact_form():
    
    # 1. Capture the form data
    name = request.form.get('fullname')
    email = request.form.get('email')
    # Using the name 'subject' from the hidden input field we added to the HTML
    subject = request.form.get('subject') 
    message_body = request.form.get('message')
    
    # Check if a subject was captured, if not, create a default one
    if not subject:
        subject = f"New message from {name}"

    # 2. Build the email content
    # Recipient is hardcoded to your desired email address: ravidrave4@gmail.com
    msg = Message(
        subject=f'[PORTFOLIO QUERY] {subject}',
        recipients=['ravidrave4@gmail.com'], 
        body=f"""
New Message Received:
------------------------------
Name: {name}
Reply-To Email: {email}
Subject: {subject}

Message: 
{message_body}
------------------------------
"""
    )

    # 3. Send the email
    try:
        mail.send(msg)
        print("Success: Email sent!")
    except Exception as e:
        # This will print the exact error if the email fails (e.g., bad password)
        print(f"ERROR: Email failed to send. Check MAIL_USERNAME/MAIL_PASSWORD. Error: {e}")

    # 4. Redirect the user after submission
    # Redirects them back to the main page or contact page.
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
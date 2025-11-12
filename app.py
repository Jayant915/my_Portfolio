from flask import Flask, render_template, request, redirect, url_for
from flask_mail import Mail, Message
import os
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

app = Flask(__name__)

# --- Flask-Mail Configuration: Using Port 465 (SSL) ---
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465 
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True 

# --- Securely load credentials from the environment (from your .env file) ---
MAIL_USER = os.environ.get('MAIL_USERNAME')
MAIL_PASS = os.environ.get('MAIL_PASSWORD')

app.config['MAIL_USERNAME'] = MAIL_USER
app.config['MAIL_PASSWORD'] = MAIL_PASS
app.config['MAIL_DEFAULT_SENDER'] = MAIL_USER

# --- DEBUG LINE ADDED ---
# This line will confirm that the variables are loaded from Render.
# The password must be 16 characters long.
if MAIL_USER and MAIL_PASS:
    print(f"DEBUG: Mail User Check: {MAIL_USER[:3]}... | Pass Length: {len(MAIL_PASS)}")
else:
    print("DEBUG: MAIL_USERNAME or MAIL_PASSWORD not loaded!")
# -------------------------

mail = Mail(app)

# --- Standard Flask Routes ---

@app.route('/')
def index():
    return render_template('index.html') 

@app.route('/contact', methods=['POST'])
def handle_contact_form():
    
    name = request.form.get('fullname')
    email = request.form.get('email')
    subject = request.form.get('subject') 
    message_body = request.form.get('message')
    
    if not subject:
        subject = f"New message from {name}"

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

    try:
        mail.send(msg)
        print("Success: Email sent!")
    except Exception as e:
        # If this exception fires, the error is an authentication/login failure (password/username is wrong).
        # We need the full output of this exception printout.
        print(f"ERROR: Final attempt failed. Error details: {e}")
        return "An internal server error occurred while sending the message.", 500

    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
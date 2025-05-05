import speech_recognition as sr
import pyttsx3
import random

# Basic greetings for chatbot functionality
GREETING_KEYWORDS = ("hello", "hi", "greetings", "sup", "what's up")
GREETING_RESPONSES = ["Hello!", "Hey!", "Hi there!", "Greetings!", "How can I help you?"]

# FAQ dictionary with numbered entries
FAQ_RESPONSES = {
    1: ("Who is eligible to donate blood?", "Generally, individuals who are healthy, at least 17 years old, and weigh at least 110 pounds are eligible. However, eligibility may vary, so please consult local guidelines."),
    2: ("How does BloodLink match donors with recipients?", "BloodLink uses a compatibility algorithm that considers blood type, location, and urgency to match donors with those in need."),
    3: ("Where can I find nearby blood donation events?", "You can find upcoming blood donation events on BloodLink's website under the 'Events' section."),
    4: ("How can I register to donate blood?", "Simply visit the BloodLink website, create an account, and follow the registration steps to become a donor."),
    5: ("How is blood transported and stored safely?", "Blood is stored at controlled temperatures and transported in specialized containers to ensure its safety and viability."),
    6: ("Can I track the journey of my blood donation?", "Yes! BloodLink offers a tracking feature so you can follow your donation's path and see when it reaches a recipient."),
    7: ("How is my data used and protected on BloodLink?", "Your data is securely stored and only used for matching you with donation opportunities. We follow strict data protection policies."),
    8: ("Does BloodLink share my information with anyone else?", "No, your information is kept confidential and is not shared with third parties without your consent."),
    9: ("Where can I find tips for staying healthy as a donor?", "Check the 'Health Tips' section on BloodLink’s website for tips on staying healthy before and after donations."),
    10: ("What should I do in case of an emergency blood requirement?", "In case of an emergency, contact BloodLink support or check the app for urgent donation requests in your area.")
}

# Voice engine setup
engine = pyttsx3.init()
engine.setProperty('rate', 150)  # Speed percent (default is 200)
engine.setProperty('volume', 1)  # Volume (0.0 to 1.0)

# Function to speak text
def speak(text):
    engine.say(text)
    engine.runAndWait()

# Function to listen to user voice input and convert it to text
def listen():
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print("Listening...")
        audio = recognizer.listen(source)
    try:
        user_input = recognizer.recognize_google(audio)
        print(f"You said: {user_input}")
        return user_input
    except sr.UnknownValueError:
        print("Sorry, I could not understand the audio.")
        return None
    except sr.RequestError:
        print("Could not request results; check your network connection.")
        return None

# Function to display FAQ list
def list_faqs():
    faq_list = "Here are some frequently asked questions:\n"
    for i, (question, _) in FAQ_RESPONSES.items():
        faq_list += f"{i}. {question}\n"
    faq_list += "\nSay the number of the question to get the answer or say 'back' to return to the main chat."
    return faq_list

# Function to check for greetings
def check_for_greeting(sentence):
    for word in sentence.split():
        if word.lower() in GREETING_KEYWORDS:
            return random.choice(GREETING_RESPONSES)
    return None

# General response function
def get_response(user_input, in_faq_mode):
    # Check if the user is in FAQ mode
    if in_faq_mode:
        if user_input.lower() == "back":
            return "Returning to the main chat. How can I assist you?", False
        elif user_input.isdigit() and int(user_input) in FAQ_RESPONSES:
            return FAQ_RESPONSES[int(user_input)][1], True
        else:
            return "Please say a number to get an answer or 'back' to return to the main chat.", True

    # If not in FAQ mode, check for greeting and FAQ command
    greeting = check_for_greeting(user_input)
    if greeting:
        return greeting, False

    if user_input.lower() in ("faq", "help"):
        return list_faqs(), True

    # Default response
    return "I'm not sure I understand. Can you ask something else?", False

# Chat loop for text-based chatbot
def text_chatbot():
    print("You are in text-based chatbot mode. Type 'exit' to stop the chat or 'faq' to see the list of FAQs.")
    
    in_faq_mode = False
    while True:
        user_input = input("You: ")
        
        if user_input.lower() == 'exit':
            print("Chatbot: Goodbye! Have a great day!")
            speak("Goodbye! Have a great day!")
            break
        
        response, in_faq_mode = get_response(user_input, in_faq_mode)
        print("Chatbot:", response)
        speak(response)

# Chat loop with voice input and output
def voice_chatbot():
    print("You are in voice-enabled chatbot mode. Say 'exit' to stop the chat or 'faq' to see the list of FAQs.")
    speak("You are in voice-enabled chatbot mode. Say 'exit' to stop the chat or 'faq' to see the list of FAQs.")
    
    in_faq_mode = False
    while True:
        user_input = listen()
        
        if user_input is None:
            speak("Please try again.")
            continue

        if user_input.lower() == 'exit':
            print("Chatbot: Goodbye! Have a great day!")
            speak("Goodbye! Have a great day!")
            break
        
        response, in_faq_mode = get_response(user_input, in_faq_mode)
        print("Chatbot:", response)
        speak(response)

# Main function to choose mode
def main():
    print("Welcome to BloodLink Assistant!")
    speak("Welcome to BloodLink Assistant! Type 'text' for text-based chatbot or 'voice' for voice assistant.")
    
    while True:
        mode = input("Choose your mode (text/voice): ").strip().lower()
        if mode == "text":
            text_chatbot()
            break
        elif mode == "voice":
            voice_chatbot()
            break
        else:
            print("Invalid option. Please type 'text' or 'voice'.")
            speak("Invalid option. Please type 'text' or 'voice'.")

# Run the main function
if __name__ == "__main__":
    main()

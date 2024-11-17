package com.example.bloodlinkapplication.HelperCalss

import android.content.Context
import android.content.Intent
import android.os.Build
import android.speech.RecognitionListener
import android.speech.SpeechRecognizer
import android.speech.RecognizerIntent
import android.util.Log
import androidx.annotation.RequiresApi

@RequiresApi(Build.VERSION_CODES.UPSIDE_DOWN_CAKE)
class VoiceInputHelper(
    context: Context,
    private val recognitionListener: RecognitionListener
) {

    private var speechRecognizer: SpeechRecognizer? = null
    private var currentLanguage: String = "en-US" // Default language

    init {
        // Initialize SpeechRecognizer
        speechRecognizer = SpeechRecognizer.createSpeechRecognizer(context)
        speechRecognizer?.setRecognitionListener(recognitionListener)
        checkAvailableLanguages(context)
    }

    // Check available languages for SpeechRecognizer
    @RequiresApi(Build.VERSION_CODES.UPSIDE_DOWN_CAKE)
    private fun checkAvailableLanguages(context: Context) {
        val availableLanguages = SpeechRecognizer.DETECTED_LANGUAGE
        if (availableLanguages.contains("ja-JP")) {
            currentLanguage = "ja-JP" // Use Japanese if available
        } else {
            Log.d("VoiceInputHelper", "Japanese language not available, falling back to $currentLanguage")
        }
    }

    // Start voice input
    fun startVoiceInput() {
        // Prepare the speech recognizer intent
        val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_PROMPT, "Speak now") // Prompt message
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, currentLanguage) // Use the determined language
        }

        // Start listening for voice input
        speechRecognizer?.startListening(intent)
    }

    fun stopListening() {
        speechRecognizer?.stopListening()
    }

    // Release resources
    fun release() {
        speechRecognizer?.destroy()
    }
}

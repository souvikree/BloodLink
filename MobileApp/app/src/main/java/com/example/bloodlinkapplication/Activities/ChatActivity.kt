package com.example.bloodlinkapplication.Activities

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.speech.RecognizerIntent
import android.util.Log
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContract
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.fragment.app.FragmentActivity
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.bloodlinkapplication.HelperCalss.PermissionHelper
import com.example.bloodlinkapplication.HelperCalss.VoiceInputHelper
import com.example.bloodlinkapplication.R
import com.example.bloodlinkapplication.adapters.ChatAdapter
import com.example.bloodlinkapplication.databinding.ActivityChatBinding
import com.example.bloodlinkapplication.dateClass.Message
import com.example.bloodlinkapplication.dateClass.MessageShow
import kotlinx.coroutines.launch
import sendMessageToBackend

class ChatActivity : AppCompatActivity() {
    private var binding: ActivityChatBinding? = null
    private lateinit var voiceInputHelper: VoiceInputHelper
    private lateinit var adapter: ChatAdapter
    private val voiceInputStatus = MutableLiveData(false)
    private lateinit var permissionHelper: PermissionHelper
    private val recognitionCustom = registerForActivityResult(RecognitionContract()) { result ->
        if (result.isNotEmpty()) {
            binding?.editTextChatActivity?.setText(result)
            setDataToChat()
        } else {
            // Handle error, e.g., show a toast or log an error message
            Toast.makeText(this, "Speech recognition failed", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityChatBinding.inflate(layoutInflater)
        enableEdgeToEdge()
        setContentView(binding?.root)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.chat_activity_root)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }
        permissionHelper = PermissionHelper(this)
        if (!permissionHelper.isMicrophonePermissionGranted()) {
            permissionHelper.requestMicrophonePermission()
        }
        // Initialize the VoiceInputHelper with necessary parameters


        adapter = ChatAdapter(this@ChatActivity)
        binding?.backButtonChatActivity?.setOnClickListener {
            (this as? FragmentActivity)?.onBackPressedDispatcher?.onBackPressed()
        }

        setUpRecyclerView(adapter)
        val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH)
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, "Us")
        // Set up mic button to toggle voice input
        binding?.micButton?.setOnClickListener {
            recognitionCustom.launch(0)
        }
    }

    private fun setUpRecyclerView(adapter: ChatAdapter) {
        val ll = LinearLayoutManager(this@ChatActivity, RecyclerView.VERTICAL, false)
        ll.stackFromEnd = true // Ensure this is set before using the layout manager
        binding?.chatRecyclerView?.layoutManager = ll
        binding?.chatRecyclerView?.adapter = adapter

        binding?.sendMessage?.setOnClickListener {
            setDataToChat()
        }
    }

    private fun setDataToChat(){
        val text = binding?.editTextChatActivity?.text.toString().trim()

        if (text.isNotEmpty()) {
            // Create the message for the user and update the UI
            val messageUser = MessageShow(Message(text, false), true)
            adapter.updateData(messageUser)
            Log.d("message user data", messageUser.toString())

            // Clear the input field
            binding?.editTextChatActivity?.text?.clear()

            // Call the backend with the user's message
            lifecycleScope.launch {
                sendMessageToBackend(text) { message ->
                    Log.d("message Bot data", message)

                    // Check if the backend message is valid
                    val messageBot = MessageShow(Message(message, false), false)
                    adapter.updateData(messageBot) // Update UI with bot's response
                }
            }
        }
    }

    class RecognitionContract : ActivityResultContract<Int, String>() {
        override fun createIntent(context: Context, input: Int): Intent {
            val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH)
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, "en-US")
            intent.putExtra(RecognizerIntent.EXTRA_PROMPT, "Speak to Text")
            return intent
        }

        override fun parseResult(resultCode: Int, intent: Intent?): String {
            val spokenText =
                intent?.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS)?.get(0) ?: ""
            return spokenText
        }
    }

}

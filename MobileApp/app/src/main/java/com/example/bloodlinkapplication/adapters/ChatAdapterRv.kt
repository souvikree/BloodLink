package com.example.bloodlinkapplication.adapters

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.speech.tts.TextToSpeech
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.recyclerview.widget.RecyclerView
import com.example.bloodlinkapplication.databinding.ChatRecyclerViewItemBinding
import com.example.bloodlinkapplication.dateClass.MessageShow
import java.util.Locale

class ChatAdapter(
    private val context: Context,
) : RecyclerView.Adapter<ChatAdapter.MyViewHolder>() {
    private var messageList: MutableList<MessageShow> = mutableListOf()
    private var textToSpeech: TextToSpeech? = null

    // Initialize TextToSpeech engine
    private val onInitListener = TextToSpeech.OnInitListener { status ->
        if (status == TextToSpeech.SUCCESS) {
            // Successfully initialized
            val langResult = textToSpeech?.setLanguage(Locale.US)
            if (langResult == TextToSpeech.LANG_AVAILABLE || langResult == TextToSpeech.LANG_COUNTRY_AVAILABLE) {
                Log.d("TextToSpeech", "Language set successfully")
            } else {
                Log.e("TextToSpeech", "Language not available or not supported")
            }
        } else {
            // Initialization failed
            Log.e("TextToSpeech", "Initialization failed with status: $status")
            Toast.makeText(context, "Text-to-Speech initialization failed", Toast.LENGTH_SHORT).show()
        }
    }

    init {
        // Initialize TextToSpeech when the adapter is created
        textToSpeech = TextToSpeech(context, onInitListener)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): MyViewHolder {
        // Inflate the layout for each message
        val binding =
            ChatRecyclerViewItemBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return MyViewHolder(binding)
    }

    override fun onBindViewHolder(holder: MyViewHolder, position: Int) {
        val message = messageList[position]

        if (message.sentByMe) {
            holder.leftChatView.visibility = View.GONE
            holder.rightChatView.visibility = View.VISIBLE
            holder.rightTextView.text = message.message.message
            holder.textToSpeechButton.visibility=View.VISIBLE


        } else {
            holder.rightChatView.visibility = View.GONE
            holder.leftChatView.visibility = View.VISIBLE
            holder.leftTextView.text = message.message.message

            textToSpeech?.speak(
                message.message.message,
                TextToSpeech.QUEUE_FLUSH,
                null,
                null
            )
            holder.textToSpeechButton.setOnClickListener {
                Log.e("Going to text",textToSpeech.toString())
                textToSpeech?.speak(
                    message.message.message,
                    TextToSpeech.QUEUE_FLUSH,
                    null,
                    null
                )
            }
        }
    }

    fun updateData(newMessages: MessageShow) {
        val startPosition = this.messageList.size
        this.messageList.add(newMessages)
        notifyItemRangeInserted(startPosition, 1)
    }


    // Copy text to clipboard
    private fun copyTextToClipboard(text: String) {
        val clipboardManager =
            context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
        val clip = ClipData.newPlainText("message", text)
        clipboardManager.setPrimaryClip(clip)
    }

    override fun getItemCount(): Int {
        return messageList.size
    }

    inner class MyViewHolder(binding: ChatRecyclerViewItemBinding) :
        RecyclerView.ViewHolder(binding.root) {
        val leftChatView: LinearLayout = binding.leftChatView
        val rightChatView: LinearLayout = binding.rightChatView
        val leftTextView: TextView = binding.leftChatTextView
        val rightTextView: TextView = binding.rightChatTextView
        val textToSpeechButton: ImageButton = binding.textToSpeechButton
    }
}

package com.example.bloodlinkapplication.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.bloodlinkapplication.databinding.RequestListItemUiBinding

class RequestListAdapterRV : RecyclerView.Adapter<RequestListAdapterRV.ViewHolder>() {


    inner class ViewHolder(binding: RequestListItemUiBinding) : RecyclerView.ViewHolder(binding.root) {
        val textView: TextView = binding.locationTextViewRequestItem
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {

        val binding =
            RequestListItemUiBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {

    }

    override fun getItemCount(): Int {
        return 10
    }
}

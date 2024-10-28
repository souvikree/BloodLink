package com.example.bloodlinkapplication.adapters

import android.content.Context
import android.view.LayoutInflater
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.bloodlinkapplication.databinding.RequestListItemUiBinding
import com.example.bloodlinkapplication.dateClass.BloodRequest

class RequestListAdapterRV(
    private val bloodRequest: List<BloodRequest?>,
    private val context: Context,
) : RecyclerView.Adapter<RequestListAdapterRV.ViewHolder>() {


    inner class ViewHolder(binding: RequestListItemUiBinding) :
        RecyclerView.ViewHolder(binding.root) {
        val locationTextView: TextView = binding.locationTextViewRequestItem
        val nameTextView : TextView = binding.nameTextViewRequestItem
        val bloodGroupTextView : TextView = binding.bloodGroupTextViewRequestItem
        val requestImage:ImageView = binding.requestItemImageView
        val requestButton = binding.requestButton
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding =
            RequestListItemUiBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val bloodRequest = bloodRequest[position]
        holder.locationTextView.text = bloodRequest?.location
        holder.nameTextView.text = bloodRequest?.patientName
        holder.bloodGroupTextView.text = bloodRequest?.bloodGroup
        Glide.with(context).load(bloodRequest?.image).into(holder.requestImage)

        holder.requestButton.setOnClickListener {
            Toast.makeText(context,"Yet not Implemented",Toast.LENGTH_SHORT).show()
        }


    }

    override fun getItemCount(): Int {
        return bloodRequest.size
    }
}

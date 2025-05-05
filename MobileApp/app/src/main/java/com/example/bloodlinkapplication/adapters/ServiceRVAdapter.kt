package com.example.bloodlinkapplication.adapters

import android.content.Context
import android.view.LayoutInflater
import android.view.ViewGroup
import android.widget.Toast
import androidx.recyclerview.widget.RecyclerView
import com.example.bloodlinkapplication.databinding.ServiceRvListHorizontalBinding
import com.example.bloodlinkapplication.dateClass.Services

class ServiceRVAdapter(
    private val context: Context,
    private val serviceList: List<Services>
) : RecyclerView.Adapter<ServiceRVAdapter.ViewHolder>() {

    inner class ViewHolder(binding: ServiceRvListHorizontalBinding) :
        RecyclerView.ViewHolder(binding.root) {
        val serviceCardView = binding.serviceCardViewServiceList
        val serviceImageButton = binding.serviceImageButtonServiceList
        val servicesTextView = binding.serviceNameServiceList

    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding =
            ServiceRvListHorizontalBinding.inflate(
                LayoutInflater.from(parent.context),
                parent,
                false
            )
        return ViewHolder(binding)
    }

    override fun getItemCount(): Int {
        return serviceList.size
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val service = serviceList[position]

        holder.servicesTextView.text = service.title
        holder.serviceImageButton.setImageResource(service.image)

        holder.serviceCardView.setOnClickListener {
            Toast.makeText(context, "${service.title} Not yet Implemented", Toast.LENGTH_SHORT)
                .show()
        }

    }
}
package com.example.bloodlinkapplication.Fragments

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.bloodlinkapplication.GetData.bloodRequestsFakeData
import com.example.bloodlinkapplication.adapters.RequestListAdapterRV
import com.example.bloodlinkapplication.databinding.FragmentHomePageBloodLinkBinding
import com.example.bloodlinkapplication.dateClass.BloodRequest

class HomePageBloodLink : Fragment() {

    private lateinit var binding: FragmentHomePageBloodLinkBinding
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentHomePageBloodLinkBinding.inflate(inflater, container, false)
        return binding.root

    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        setupRV(bloodRequestsFakeData)
    }

    private fun setupRV(bloodRequest: List<BloodRequest?>) {
        val adapter = RequestListAdapterRV(bloodRequest,requireContext())
        binding.RequestsRecyclerViewMainPage.adapter=adapter

        // Optional: Implement a layout manager for your RecyclerView
        val layoutManager = LinearLayoutManager(context)
        binding.RequestsRecyclerViewMainPage.layoutManager = layoutManager
    }


}
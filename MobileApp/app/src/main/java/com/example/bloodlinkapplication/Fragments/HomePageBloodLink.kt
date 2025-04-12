package com.example.bloodlinkapplication.Fragments

import android.content.Intent
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.bloodlinkapplication.Activities.ChatActivity
import com.example.bloodlinkapplication.GetData.bloodRequestsFakeData
import com.example.bloodlinkapplication.GetData.servicesList
import com.example.bloodlinkapplication.adapters.RequestListAdapterRV
import com.example.bloodlinkapplication.adapters.ServiceRVAdapter
import com.example.bloodlinkapplication.databinding.FragmentHomePageBloodLinkBinding
import com.example.bloodlinkapplication.dateClass.BloodRequest
import com.example.bloodlinkapplication.dateClass.Services
import org.imaginativeworld.whynotimagecarousel.model.CarouselItem

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
        setupRVForService(servicesList)
        carouselViewSetup()
        binding.chatButton.setOnClickListener {
            val intent = Intent(requireContext(), ChatActivity::class.java)
            startActivity(intent)
        }
    }

    private fun setupRVForService(serviceList:List<Services>){
        val adapterRV=ServiceRVAdapter(requireContext(),serviceList)

        binding.serviceHorizontalRvViewMainPage.adapter=adapterRV
        binding.serviceHorizontalRvViewMainPage.layoutManager=LinearLayoutManager(context,LinearLayoutManager.HORIZONTAL,false)
    }

    private fun carouselViewSetup(){
        val carousel = binding.mainPageBannerImageCarousel
        val list = mutableListOf<CarouselItem>()

        list.add(
            CarouselItem(
                imageUrl = "https://tse3.mm.bing.net/th?id=OIG1.SM9yL7pIE4257OM3qdcv&pid=ImgGn",
                caption = "Donate Blood save life"
            )
        )
        list.add(
            CarouselItem(
                imageUrl = "https://tse1.mm.bing.net/th?id=OIG1.OXmtHXpn2raiIC4p8rQw&pid=ImgGn",
                caption = "Saving Life blood delivery"
            )
        )
        list.add(
            CarouselItem(
                imageUrl = "https://tse1.mm.bing.net/th?id=OIG2.QtDbhc_XzfMtZZVw1BUV&pid=ImgGn",
                caption = "Give the gift of life"
            )
        )
        carousel.setData(list)
    }

    private fun setupRV(bloodRequest: List<BloodRequest?>) {
        val adapter = RequestListAdapterRV(bloodRequest,requireContext())
        binding.RequestsRecyclerViewMainPage.adapter=adapter
        binding.RequestsRecyclerViewMainPage.isEnabled=false
        val layoutManager = LinearLayoutManager(context)
        binding.RequestsRecyclerViewMainPage.isNestedScrollingEnabled=false
        binding.RequestsRecyclerViewMainPage.layoutManager = layoutManager
    }


}
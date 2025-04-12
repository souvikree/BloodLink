package com.example.bloodlinkapplication.Activities

import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.fragment.app.Fragment
import com.example.bloodlinkapplication.Fragments.AppointmentPageBloodLink
import com.example.bloodlinkapplication.Fragments.HomePageBloodLink
import com.example.bloodlinkapplication.Fragments.ProfilePageBloodLink
import com.example.bloodlinkapplication.Fragments.RequestPageBloodLink
import com.example.bloodlinkapplication.R
import com.example.bloodlinkapplication.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        binding= ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }
        replaceFragment(HomePageBloodLink())



        binding.bottomNavigationView.setOnItemSelectedListener {item->
                when(item.itemId){
                    R.id.home-> replaceFragment(HomePageBloodLink())
                    R.id.appointments-> replaceFragment(AppointmentPageBloodLink())
                    R.id.requests-> replaceFragment(RequestPageBloodLink())
                    R.id.profile-> replaceFragment(ProfilePageBloodLink())
                }
            true
        }

    }



    private fun replaceFragment(fragment: Fragment){
        val fragmentManager = supportFragmentManager
        val fragmentTransaction= fragmentManager.beginTransaction()
        fragmentTransaction.replace(R.id.frameLayoutMainScreen,fragment)
        fragmentTransaction.commit()
    }


}
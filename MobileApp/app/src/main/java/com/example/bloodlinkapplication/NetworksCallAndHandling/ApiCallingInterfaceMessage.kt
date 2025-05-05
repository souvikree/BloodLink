package com.example.bloodlinkapplication.NetworksCallAndHandling

import com.example.bloodlinkapplication.dateClass.Message
import com.example.bloodlinkapplication.dateClass.MessageRequest
import com.example.bloodlinkapplication.dateClass.MessageResponse
import retrofit2.Call
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface ApiCallingInterfaceMessage {
    @GET("/api/chatbot/message")
    fun getMessages(@Path("message") message: String): Call<Message>
    @POST("/api/chatbot/message")
    suspend fun sendMessage(@Body message: MessageRequest): Response<MessageResponse>

}
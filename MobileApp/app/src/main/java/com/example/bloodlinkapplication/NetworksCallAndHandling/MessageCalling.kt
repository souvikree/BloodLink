import com.example.bloodlinkapplication.NetworksCallAndHandling.ApiCallingInterfaceMessage
import com.example.bloodlinkapplication.dateClass.MessageRequest
import com.example.bloodlinkapplication.dateClass.MessageResponse
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.Response
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

fun setUpConnection() : ApiCallingInterfaceMessage {
    val BASE_URL = "https://bloodlink-flsd.onrender.com/"
    val retrofit: Retrofit by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    val service = retrofit.create(ApiCallingInterfaceMessage::class.java)
    return service
}
// Function to send message and get a response from the server
suspend fun sendMessageToBackend(message: String, onResponse: (String) -> Unit) {
    val retrofit = Retrofit.Builder()
        .baseUrl("https://bloodlink-flsd.onrender.com/")
        .addConverterFactory(GsonConverterFactory.create())
        .build()

    val service = retrofit.create(ApiCallingInterfaceMessage::class.java)

    try {
        val messageRequest = MessageRequest(message)
        val response: Response<MessageResponse> = withContext(Dispatchers.IO) {
            service.sendMessage(messageRequest)
        }

        if (response.isSuccessful) {
            val data = response.body()
            if (data != null) {
                // Handle the response, for example, update UI with the reply
                onResponse(data.reply)
            } else {
                // Handle case when the response is null
                onResponse("No reply from the server")
            }
        } else {
            // Handle failure in response
            onResponse("Error: ${response.message()}")
        }
    } catch (e: Exception) {
        // Handle exception
        onResponse("Error sending message to backend: ${e.message}")
    }
}
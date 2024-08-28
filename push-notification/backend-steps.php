<?php 
# ========== api.php ==========
// subscribed by clients - for just client
Route::post('push-subscribe', [PushSubscriptionController::class, 'pushSubscribe']);
// get subscription list
Route::get('get-subscriptions', [PushSubscriptionController::class, 'getSubscriptions']);
// Notify
Route::post('send-notification/{subscriptionId}', [PushSubscriptionController::class, 'sendNotification']);


# ========== PushSubscriptionController.php ==========
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PushSubscription;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Support\Facades\DB;
use Minishlink\WebPush\Subscription;
use Minishlink\WebPush\WebPush;

class PushSubscriptionController extends Controller
{
    /**
     * Subscribed by clients
     */
    public function pushSubscribe(Request $request)
    {
        $doesAlreadyExist = PushSubscription::where('data', $request->getContent())->first();

        if ($doesAlreadyExist) {
            return;
        }

        $request->validate([
            'data' => 'required|unique:push_subscriptions'
        ]);
        try {
            PushSubscription::create([
                'data' => $request->getContent()
            ]);
            return $this->successResponse(null);
        } catch (Exception $e) {
            return $this->failsResponse('Failed to subscribe', $e->getMessage());
        }
    }

    /**
     * Get subscription list
     */
    public function getSubscriptions()
    {
        try {
            $data = PushSubscription::all();
            return $this->successResponse($data);
        } catch (Exception $e) {
            return $this->failsResponse('Failed to retrieve subscriptions', $e->getMessage());
        }
    }

    /**
     * Notify the subscription
     */
    public function sendNotification(Request $request, $subscriptionId)
    {
        DB::beginTransaction();
        try {
            $pushSubscription = PushSubscription::find($subscriptionId);
            $webPush = new WebPush([
                "VAPID" => [
                    "publicKey" => "BCKU6syjcBdoV3EO3w-k8nior__YBYCTtBPDeD5oqGTwG5D6WVCOdGk2TCOaMQhcJK6-9MvNSAqlb_97CWXshmU",
                    "privateKey" => "ongKJvvPRVBWXF_KFWrPZt4eRaRoV7gXc15kSDwp-sY",
                    "subject" => "http://localhost:5173"
                ]
            ]);
            $result = $webPush->sendOneNotification(
                Subscription::create(json_decode($pushSubscription->data, true)),
                json_encode($request->input())
            );
            return $this->successResponse($result);
            DB::commit();
        } catch (\Exception $e) {
            return $this->failsResponse('Failed to send notification', $e->getMessage());
            DB::rollBack();
        }
    }
}




<?php
 
namespace App\Http\Controllers;
 
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
 
class AuthController extends Controller
{
    public function register(Request $reqest)
    {
        $validator = Validator::make($reqest->all(),[
            'username' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8'
        ]);
 
        if($validator->fails()){
            return response()->json(['success'=> false, 'data'=> $validator->errors()]);
        }
 
        $user = User::create([
            'username'=> $reqest->username,
            'email'=> $reqest->email,
            'password'=> Hash::make($reqest->password),
            'role'=>'user'
        ]);
 
        $token = $user->createToken('auth_token')->plainTextToken;
 
        return response()->json(['success'=>true,'data'=> $user, 'access_token'=> $token, 'token_type'=> 'Bearer']);
    }
 
    public function login(Request $request)
    {
        if(!Auth::attempt($request->only('email','password'))){
            return response()->json(['success'=> false]);
        }
 
        $user = User::where('email', $request['email'])->firstOrFail();
 
        $token = $user->createToken('auth_token')->plainTextToken;
 
        return response()->json(['success'=>true,'data'=> $user, 'access_token'=> $token, 'token_type'=> 'Bearer','role'=>$user->role]);
    }
 
    public function logout(Request $request)
    {
       $request->user()->tokens()->delete();
       return response()->json(['message'=> 'Successfully logged out!']);
    }
}
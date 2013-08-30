package com.example.nyan;

import java.io.Console;

import org.apache.cordova.DroidGap;

import android.os.Bundle;
import android.util.Log;
import android.app.Activity;


public class MainActivity extends DroidGap {

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		super.loadUrl("file:///android_asset/www/index.html");
	}
}

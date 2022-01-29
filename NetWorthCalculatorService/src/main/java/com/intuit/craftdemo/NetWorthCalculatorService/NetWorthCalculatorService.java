package com.intuit.craftdemo.NetWorthCalculatorService;

import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class NetWorthCalculatorService {

	public UserData calculateNetWorth(UserData input) {
		// TODO: Call an external currency conversion service
		UserData output = input;

		float totalAssets = 0;
		for (Map.Entry<String, Float> entry : output.getAssets().entrySet()) {
			totalAssets += entry.getValue();
		}

		float totalLiabilities = 0;
		for (Map.Entry<String, Float> entry : output.getLiabilities().entrySet()) {
			totalLiabilities += entry.getValue();
		}

		float totalNetWorth = totalAssets - totalLiabilities;

		output.setTotalNetWorth(totalNetWorth);
		output.setTotalAssets(totalAssets);
		output.setTotalLiabilities(totalLiabilities);

		return output;
	}
}
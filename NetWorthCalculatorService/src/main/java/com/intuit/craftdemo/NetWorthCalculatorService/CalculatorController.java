package com.intuit.craftdemo.NetWorthCalculatorService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class CalculatorController {
	Logger logger = LoggerFactory.getLogger(CalculatorController.class);

	@Autowired
	NetWorthCalculatorService nwcService;

	@PostMapping("/api/v1/calculateNetWorth")
	public UserData calculateNetWorth(@RequestBody(required = false) UserData request) {
		logger.debug("Calculate networth called");
		UserData response = nwcService.calculateNetWorth(request);
		return response;
	}

	@GetMapping("/api/v1/user/{userId}")
	public UserData findUser(@PathVariable Long userId) {
		logger.debug("Get Networth called");
		UserData response = nwcService.getOrCreateUser(userId);
		return response;
	}
}

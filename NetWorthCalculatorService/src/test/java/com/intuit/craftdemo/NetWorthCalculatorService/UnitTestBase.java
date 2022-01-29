package com.intuit.craftdemo.NetWorthCalculatorService;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = { "free.currconv.access-key=test" })
public abstract class UnitTestBase {

}

<role>
You are a Senior QA Engineer expertized in preconditions and test data analysis
</role>

<task>
Your job is to create a skill that reads files from @codegen-recordings and carefully reviews what test data is needed for the test
and if any preconditions need to be prepared for it.
</task>

<input_data>
You will receive this similar file as a context @login-pim-add-employee-20260903-200900.md](../codegen-recordings/login-pim-add-employee-20260903-200900.md
</input_data>

<output>
Produce analysis file inside @[precondition-test-data-plan](../precondition-test-data-plan)
It must say what needs to be prepared to execute the test
It also specifies anything important such as dates (if recording enters random dates to try and prepare the test for that, etc)
</output>

<constraints>
- Please make the skill concise, precise and easy to maintain and read
</constraints>
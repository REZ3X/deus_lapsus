# Database Triggers Explained: Automatic SQL Operations

Ever wondered how some databases automatically update related data, maintain logs, or enforce complex business rules without application code?

Database triggers are stored procedures that run automatically when specific events happen in your database. They work behind the scenes, watching every INSERT, UPDATE, and DELETE operation.

Think of triggers as database-level automation that executes your instructions consistently, regardless of which application makes the change. Let's explore how they work.

---

## What Are Database Triggers?

Database triggers are special stored procedures that run automatically when specific events happen in your database. The key word here is automatically - you don't call them, they execute on their own.

### Think of it like this:

```sql
-- When someone does this...
INSERT INTO users (name, email) VALUES ('John', 'john@example.com');

-- Your trigger can automatically do this...
-- ✅ Validate the email format
-- ✅ Send a welcome email
-- ✅ Log the action for audit
-- ✅ Update user statistics
-- And much more!
```

**Key characteristics:**

- **Automatic execution** - No manual intervention needed
- **Event-driven** - Responds to database events instantly
- **Database-level** - Runs regardless of which application makes the change
- **Transparent to applications** - Your application doesn't need to know they exist

---

## Why Use Database Triggers?

### **Automated Operations**

Write once, run forever. Triggers handle routine tasks automatically without manual intervention.

### **Data Integrity**

Enforce business rules at the database level. Even direct database access respects these rules.

### **Performance Benefits**

Keep logic close to your data. No network round-trips, no application overhead - just database-level efficiency.

### **Audit Trails**

Ideal for compliance. Every change gets logged automatically with no possibility of bypassing.

Triggers can prevent data inconsistencies and save significant debugging time in production environments.

---

## The Three Types of Triggers (By Timing)

### **BEFORE Triggers**

These run before the main event happens. Perfect for:

```sql
-- Validate data before it gets saved
-- Auto-generate values (like timestamps)
-- Prevent invalid data from entering your system
```

BEFORE triggers act as gatekeepers, checking and modifying data before it reaches the table.

### **AFTER Triggers**

These run after the main event completes successfully. Great for:

```sql
-- Logging what just happened
-- Updating related tables
-- Sending notifications
-- Cleanup operations
```

AFTER triggers handle consequences of successful operations, maintaining consistency across related data.

### **INSTEAD OF Triggers** (Advanced)

These replace the original operation entirely. Mostly used with views to make them updatable.

INSTEAD OF triggers provide complete control over how an operation is executed, useful for complex view updates.

---

## The Three Database Events

Triggers respond to three main operations:

- **INSERT** - New data being added
- **UPDATE** - Existing data being modified
- **DELETE** - Data being removed

Now let's look at some real examples.

---

## Real-World Examples (MySQL Edition)

Let's build a complete employee management system with triggers to demonstrate practical applications.

### **Setting Up the Database**

First, create the necessary tables:

```sql
-- Main employees table
CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    salary DECIMAL(10,2),
    department VARCHAR(50),
    hire_date DATE,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Audit trail table for compliance
CREATE TABLE employee_audit (
    audit_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,
    action VARCHAR(10),
    old_values JSON,
    new_values JSON,
    changed_by VARCHAR(100),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45)
);

-- Salary history tracking
CREATE TABLE salary_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,
    old_salary DECIMAL(10,2),
    new_salary DECIMAL(10,2),
    change_reason VARCHAR(255),
    effective_date DATE DEFAULT (CURDATE()),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- Company statistics for reporting
CREATE TABLE company_stats (
    id INT PRIMARY KEY DEFAULT 1,
    total_employees INT DEFAULT 0,
    average_salary DECIMAL(10,2) DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Initialize stats
INSERT INTO company_stats (total_employees, average_salary) VALUES (0, 0);
```

---

### **Example 1: Data Validation (BEFORE INSERT)**

This trigger validates and formats data before insertion:

```sql
DELIMITER $$

CREATE TRIGGER validate_new_employee
    BEFORE INSERT ON employees
    FOR EACH ROW
BEGIN
    -- Email validation
    IF NEW.email NOT REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid email format. Please check and try again.';
    END IF;

    -- Salary validation
    IF NEW.salary <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Salary must be greater than 0.';
    END IF;

    -- Prevent unrealistic salaries
    IF NEW.salary > 1000000 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Salary exceeds maximum threshold. Please verify.';
    END IF;

    -- Auto-set hire date if not provided
    IF NEW.hire_date IS NULL THEN
        SET NEW.hire_date = CURDATE();
    END IF;

    -- Format names consistently
    SET NEW.first_name = CONCAT(
        UPPER(SUBSTRING(NEW.first_name, 1, 1)),
        LOWER(SUBSTRING(NEW.first_name, 2))
    );

    SET NEW.last_name = CONCAT(
        UPPER(SUBSTRING(NEW.last_name, 1, 1)),
        LOWER(SUBSTRING(NEW.last_name, 2))
    );

    -- Generate employee email if department email needed
    IF NEW.department IS NOT NULL AND NEW.email LIKE '%@temp.com' THEN
        SET NEW.email = CONCAT(
            LOWER(NEW.first_name), '.',
            LOWER(NEW.last_name),
            '@', LOWER(NEW.department), '.company.com'
        );
    END IF;
END$$

DELIMITER ;
```

**What this does:**

- Validates email format
- Ensures positive salary
- Prevents unrealistic salaries
- Auto-sets hire date
- Formats names consistently
- Can generate department emails

---

### **Example 2: Audit Logging (AFTER INSERT)**

This trigger logs all insertions and maintains statistics:

```sql
DELIMITER $$

CREATE TRIGGER log_new_employee
    AFTER INSERT ON employees
    FOR EACH ROW
BEGIN
    -- Log the new employee in audit trail
    INSERT INTO employee_audit (
        employee_id,
        action,
        new_values,
        changed_by,
        ip_address
    )
    VALUES (
        NEW.id,
        'INSERT',
        JSON_OBJECT(
            'first_name', NEW.first_name,
            'last_name', NEW.last_name,
            'email', NEW.email,
            'salary', NEW.salary,
            'department', NEW.department,
            'hire_date', NEW.hire_date,
            'status', NEW.status
        ),
        COALESCE(USER(), 'system'),
        COALESCE(@client_ip, 'unknown')
    );

    -- Record initial salary in history
    INSERT INTO salary_history (
        employee_id,
        new_salary,
        change_reason
    )
    VALUES (
        NEW.id,
        NEW.salary,
        'Initial salary upon hiring'
    );

    -- Update company statistics
    UPDATE company_stats
    SET
        total_employees = (SELECT COUNT(*) FROM employees WHERE status = 'active'),
        average_salary = (SELECT AVG(salary) FROM employees WHERE status = 'active'),
        last_updated = NOW()
    WHERE id = 1;
END$$

DELIMITER ;
```

**What this does:**

- Creates audit log entry
- Records initial salary
- Updates company statistics
- Timestamps everything

---

### **Example 3: Business Rule Enforcement (BEFORE UPDATE)**

This trigger enforces business rules before changes are applied:

```sql
DELIMITER $$

CREATE TRIGGER enforce_update_rules
    BEFORE UPDATE ON employees
    FOR EACH ROW
BEGIN
    -- Prevent massive salary cuts
    IF NEW.salary < OLD.salary * 0.7 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot reduce salary by more than 30%.';
    END IF;

    -- Prevent future hire dates
    IF NEW.hire_date > CURDATE() THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Hire date cannot be in the future.';
    END IF;

    -- Email validation if changed
    IF NEW.email != OLD.email THEN
        IF NEW.email NOT REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Invalid email format. Please verify.';
        END IF;
    END IF;

    -- Department-specific salary rules
    CASE NEW.department
        WHEN 'Intern' THEN
            IF NEW.salary > 50000 THEN
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Intern salary cap is $50,000';
            END IF;
        WHEN 'Executive' THEN
            IF NEW.salary < 150000 THEN
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Executive minimum salary is $150,000';
            END IF;
        ELSE
            -- Regular validation
            IF NEW.salary > 200000 THEN
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Salary requires executive approval for amounts over $200,000';
            END IF;
    END CASE;

    -- Auto-update timestamp
    SET NEW.updated_at = NOW();
END$$

DELIMITER ;
```

**What this does:**

- Prevents drastic salary cuts
- Validates hire dates
- Checks email format changes
- Enforces department-specific rules
- Updates timestamps automatically

---

### **Example 4: Change Tracking (AFTER UPDATE)**

This trigger logs all changes and maintains history:

```sql
DELIMITER $$

CREATE TRIGGER track_employee_changes
    AFTER UPDATE ON employees
    FOR EACH ROW
BEGIN
    -- Always log updates to audit trail
    INSERT INTO employee_audit (
        employee_id,
        action,
        old_values,
        new_values,
        changed_by,
        ip_address
    )
    VALUES (
        NEW.id,
        'UPDATE',
        JSON_OBJECT(
            'first_name', OLD.first_name,
            'last_name', OLD.last_name,
            'email', OLD.email,
            'salary', OLD.salary,
            'department', OLD.department,
            'status', OLD.status
        ),
        JSON_OBJECT(
            'first_name', NEW.first_name,
            'last_name', NEW.last_name,
            'email', NEW.email,
            'salary', NEW.salary,
            'department', NEW.department,
            'status', NEW.status
        ),
        COALESCE(USER(), 'system'),
        COALESCE(@client_ip, 'unknown')
    );

    -- Track salary changes specifically
    IF OLD.salary != NEW.salary THEN
        INSERT INTO salary_history (
            employee_id,
            old_salary,
            new_salary,
            change_reason
        )
        VALUES (
            NEW.id,
            OLD.salary,
            NEW.salary,
            COALESCE(@salary_change_reason, 'Salary adjustment')
        );
    END IF;

    -- Update company stats if salary or status changed
    IF OLD.salary != NEW.salary OR OLD.status != NEW.status THEN
        UPDATE company_stats
        SET
            total_employees = (SELECT COUNT(*) FROM employees WHERE status = 'active'),
            average_salary = (SELECT AVG(salary) FROM employees WHERE status = 'active'),
            last_updated = NOW()
        WHERE id = 1;
    END IF;

    -- Special handling for status changes
    IF OLD.status != NEW.status THEN
        INSERT INTO employee_audit (
            employee_id,
            action,
            old_values,
            new_values,
            changed_by
        )
        VALUES (
            NEW.id,
            'STATUS_CHANGE',
            JSON_OBJECT('status', OLD.status),
            JSON_OBJECT('status', NEW.status),
            COALESCE(USER(), 'system')
        );
    END IF;
END$$

DELIMITER ;
```

**What this does:**

- Logs all changes in detail
- Tracks salary changes specifically
- Updates company statistics
- Handles status changes specially

---

### **Example 5: Deletion Protection (BEFORE DELETE)**

This trigger prevents unauthorized or dangerous deletions:

```sql
DELIMITER $$

CREATE TRIGGER protect_employee_data
    BEFORE DELETE ON employees
    FOR EACH ROW
BEGIN
    -- Prevent deletion of high-value employees
    IF OLD.salary > 150000 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot delete high-salary employees without HR approval.';
    END IF;

    -- Prevent deletion during business hours
    IF HOUR(NOW()) BETWEEN 9 AND 17 AND DAYOFWEEK(NOW()) BETWEEN 2 AND 6 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Employee deletion not allowed during business hours (9 AM - 5 PM, Mon-Fri)';
    END IF;

    -- Prevent deletion of recent hires
    IF DATEDIFF(CURDATE(), OLD.hire_date) < 90 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot delete employees hired within the last 90 days. Consider status change instead.';
    END IF;

    -- Require special authorization for certain departments
    IF OLD.department IN ('Executive', 'HR', 'Finance') AND @delete_authorized != 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = CONCAT('Deletion of ', OLD.department, ' employees requires special authorization.');
    END IF;
END$$

DELIMITER ;
```

**What this does:**

- Protects high-salary employees
- Prevents deletions during business hours
- Protects recent hires
- Requires authorization for special departments

---

### **Example 6: Post-Deletion Cleanup (AFTER DELETE)**

This trigger handles cleanup and logging after deletions:

```sql
DELIMITER $$

CREATE TRIGGER cleanup_after_deletion
    AFTER DELETE ON employees
    FOR EACH ROW
BEGIN
    -- Log the deletion for audits
    INSERT INTO employee_audit (
        employee_id,
        action,
        old_values,
        changed_by,
        ip_address
    )
    VALUES (
        OLD.id,
        'DELETE',
        JSON_OBJECT(
            'first_name', OLD.first_name,
            'last_name', OLD.last_name,
            'email', OLD.email,
            'salary', OLD.salary,
            'department', OLD.department,
            'hire_date', OLD.hire_date,
            'status', OLD.status
        ),
        COALESCE(USER(), 'system'),
        COALESCE(@client_ip, 'unknown')
    );

    -- Archive salary history instead of deleting
    UPDATE salary_history
    SET
        change_reason = CONCAT(change_reason, ' [EMPLOYEE DELETED]'),
        created_at = NOW()
    WHERE employee_id = OLD.id;

    -- Update company statistics
    UPDATE company_stats
    SET
        total_employees = (SELECT COUNT(*) FROM employees WHERE status = 'active'),
        average_salary = (SELECT AVG(salary) FROM employees WHERE status = 'active'),
        last_updated = NOW()
    WHERE id = 1;
END$$

DELIMITER ;
```

**What this does:**

- Creates deletion audit log
- Archives related data instead of deleting
- Updates company statistics
- Tags historical data appropriately

---

## Testing the Triggers

Let's test the triggers to verify they work correctly:

```sql
-- Test 1: Insert a new employee
INSERT INTO employees (first_name, last_name, email, salary, department)
VALUES ('john', 'doe', 'john.doe@company.com', 75000, 'Engineering');
-- Should auto-format names, validate email, log everything

-- Test 2: Update salary (valid increase)
UPDATE employees
SET salary = 85000
WHERE email = 'john.doe@company.com';
-- Should log change and update salary history

-- Test 3: Try invalid salary reduction (should fail)
UPDATE employees
SET salary = 30000  -- Too big a reduction
WHERE email = 'john.doe@company.com';
-- Should be blocked by trigger

-- Test 4: Try invalid email (should fail)
INSERT INTO employees (first_name, last_name, email, salary, department)
VALUES ('Jane', 'Smith', 'invalid-email', 60000, 'Marketing');
-- Should be blocked by email validation

-- Test 5: Check our audit trail
SELECT
    ea.action,
    ea.changed_by,
    ea.changed_at,
    JSON_UNQUOTE(JSON_EXTRACT(ea.new_values, '$.first_name')) as first_name,
    JSON_UNQUOTE(JSON_EXTRACT(ea.new_values, '$.salary')) as salary
FROM employee_audit ea
ORDER BY ea.changed_at DESC;

-- Test 6: Check salary history
SELECT
    sh.*,
    CONCAT(e.first_name, ' ', e.last_name) as employee_name
FROM salary_history sh
JOIN employees e ON sh.employee_id = e.id
ORDER BY sh.created_at DESC;

-- Test 7: Check company stats
SELECT * FROM company_stats;
```

Always test both valid and invalid scenarios to ensure your triggers handle all cases correctly.

---

## Advanced Trigger Techniques

### **Conditional Logic**

```sql
DELIMITER $$

CREATE TRIGGER smart_employee_handler
    BEFORE UPDATE ON employees
    FOR EACH ROW
BEGIN
    -- Department-specific logic
    CASE NEW.department
        WHEN 'Sales' THEN
            -- Sales team specific rules
            IF NEW.salary > 120000 AND @commission_approved != 1 THEN
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Sales salary over $120k requires commission structure approval';
            END IF;

        WHEN 'Engineering' THEN
            -- Engineering specific rules
            IF NEW.salary < 70000 AND NEW.status = 'active' THEN
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Engineering minimum salary is $70,000';
            END IF;

        WHEN 'Executive' THEN
            -- Executive level requires board approval
            IF ABS(NEW.salary - OLD.salary) > 25000 AND @board_approved != 1 THEN
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Executive salary changes over $25k require board approval';
            END IF;
    END CASE;

    -- Time-based logic
    IF NEW.status = 'inactive' AND HOUR(NOW()) NOT BETWEEN 9 AND 17 THEN
        -- Auto-schedule reactivation for next business day
        SET @schedule_reactivation = 1;
    END IF;
END$$

DELIMITER ;
```

### **Data Transformations**

```sql
DELIMITER $$

CREATE TRIGGER enrich_employee_data
    BEFORE INSERT ON employees
    FOR EACH ROW
BEGIN
    -- Generate employee ID
    SET NEW.employee_code = CONCAT(
        UPPER(LEFT(COALESCE(NEW.department, 'GEN'), 3)),
        YEAR(CURDATE()),
        LPAD(
            (SELECT COALESCE(MAX(id), 0) + 1 FROM employees),
            4, '0'
        )
    );

    -- Auto-assign salary grade
    SET NEW.salary_grade = CASE
        WHEN NEW.salary < 50000 THEN 'Junior'
        WHEN NEW.salary < 80000 THEN 'Mid-Level'
        WHEN NEW.salary < 120000 THEN 'Senior'
        WHEN NEW.salary < 200000 THEN 'Principal'
        ELSE 'Executive'
    END;

    -- Set probation end date
    SET NEW.probation_end = DATE_ADD(NEW.hire_date, INTERVAL 90 DAY);

    -- Generate internal email if needed
    IF NEW.email LIKE '%@temp.%' THEN
        SET NEW.email = CONCAT(
            LOWER(NEW.first_name), '.',
            LOWER(NEW.last_name),
            DATE_FORMAT(NOW(), '%y'),
            '@company.com'
        );
    END IF;
END$$

DELIMITER ;
```

---

## Performance Considerations

### **Best Practices for Performance**

```sql
-- Good: Simple, direct operations
CREATE TRIGGER fast_timestamp_update
    BEFORE UPDATE ON employees
    FOR EACH ROW
    SET NEW.updated_at = NOW();

-- Good: Single table operations
CREATE TRIGGER efficient_audit
    AFTER UPDATE ON employees
    FOR EACH ROW
    INSERT INTO audit_log (table_name, record_id, action, timestamp)
    VALUES ('employees', NEW.id, 'UPDATE', NOW());
```

### **What to Avoid**

```sql
-- Bad: Complex subqueries in triggers
-- CREATE TRIGGER performance_killer
--     AFTER INSERT ON employees
--     FOR EACH ROW
--     UPDATE department_stats SET avg_salary = (
--         SELECT AVG(salary) FROM employees e2
--         WHERE e2.department = NEW.department
--         AND e2.hire_date > (
--             SELECT MIN(hire_date) FROM employees e3...
--         )
--     ); -- This will be SLOW!
```

### **Performance Optimization**

```sql
DELIMITER $$

CREATE TRIGGER optimized_stats_update
    AFTER INSERT ON employees
    FOR EACH ROW
BEGIN
    -- Use direct calculation instead of complex queries
    SET @dept_count = (SELECT employee_count FROM department_stats WHERE dept = NEW.department);
    SET @dept_total = (SELECT salary_total FROM department_stats WHERE dept = NEW.department);

    -- Simple math instead of AVG() query
    UPDATE department_stats
    SET
        employee_count = @dept_count + 1,
        salary_total = @dept_total + NEW.salary,
        avg_salary = (@dept_total + NEW.salary) / (@dept_count + 1)
    WHERE dept = NEW.department;
END$$

DELIMITER ;
```

---

## Debugging and Troubleshooting

### **Add Logging for Debugging**

```sql
-- Create a debug table first
CREATE TABLE trigger_debug (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trigger_name VARCHAR(100),
    message TEXT,
    data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Then add logging to your triggers
DELIMITER $$

CREATE TRIGGER debuggable_employee_trigger
    BEFORE INSERT ON employees
    FOR EACH ROW
BEGIN
    -- Log entry point
    INSERT INTO trigger_debug (trigger_name, message, data)
    VALUES ('debuggable_employee_trigger', 'Trigger started', JSON_OBJECT('email', NEW.email));

    -- Your logic here with debug points
    IF NEW.email NOT REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        INSERT INTO trigger_debug (trigger_name, message, data)
        VALUES ('debuggable_employee_trigger', 'Email validation failed', JSON_OBJECT('email', NEW.email));

        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid email format';
    END IF;

    -- Log success
    INSERT INTO trigger_debug (trigger_name, message, data)
    VALUES ('debuggable_employee_trigger', 'Trigger completed successfully', JSON_OBJECT('email', NEW.email));
END$$

DELIMITER ;
```

### **Error Handling**

```sql
DELIMITER $$

CREATE TRIGGER robust_employee_processor
    BEFORE INSERT ON employees
    FOR EACH ROW
BEGIN
    DECLARE v_error_count INT DEFAULT 0;
    DECLARE v_error_msg TEXT DEFAULT '';

    -- Use a handler for any SQL exceptions
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1
            v_error_count = NUMBER,
            v_error_msg = MESSAGE_TEXT;

        -- Log the error
        INSERT INTO error_log (
            error_source,
            error_message,
            error_data,
            occurred_at
        )
        VALUES (
            'robust_employee_processor',
            v_error_msg,
            JSON_OBJECT('employee_data', JSON_OBJECT(
                'first_name', NEW.first_name,
                'last_name', NEW.last_name,
                'email', NEW.email
            )),
            NOW()
        );

        -- Re-raise the error with more context
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = CONCAT('Employee processing failed: ', v_error_msg);
    END;

    -- Your trigger logic here
    -- If anything fails, the handler above will catch it

END$$

DELIMITER ;
```

---

## Real-World Use Cases

### **1. E-commerce Inventory Management**

```sql
-- Auto-update stock when orders are placed
CREATE TRIGGER update_inventory_on_order
    AFTER INSERT ON order_items
    FOR EACH ROW
    UPDATE products
    SET
        stock_quantity = stock_quantity - NEW.quantity,
        last_sold = NOW()
    WHERE id = NEW.product_id;

-- Send low-stock alerts
CREATE TRIGGER check_low_stock
    AFTER UPDATE ON products
    FOR EACH ROW
    IF NEW.stock_quantity < NEW.reorder_point AND OLD.stock_quantity >= OLD.reorder_point THEN
        INSERT INTO stock_alerts (product_id, alert_type, message)
        VALUES (NEW.id, 'LOW_STOCK', CONCAT('Product ', NEW.name, ' is running low!'));
    END IF;
```

### **2. User Activity Tracking**

```sql
-- Track user login patterns
CREATE TRIGGER log_user_activity
    AFTER UPDATE ON user_sessions
    FOR EACH ROW
    IF NEW.last_activity > OLD.last_activity THEN
        INSERT INTO user_activity_log (user_id, activity_type, ip_address, user_agent)
        VALUES (NEW.user_id, 'page_view', NEW.ip_address, NEW.user_agent);
    END IF;
```

### **3. Data Synchronization**

```sql
-- Keep denormalized data in sync
CREATE TRIGGER sync_user_profile_cache
    AFTER UPDATE ON users
    FOR EACH ROW
    UPDATE user_profile_cache
    SET
        display_name = CONCAT(NEW.first_name, ' ', NEW.last_name),
        avatar_url = NEW.avatar_url,
        last_updated = NOW()
    WHERE user_id = NEW.id;
```

---

## Best Practices

### **Core Principles**

1. **Document Everything**

   ```sql
   -- ALWAYS add comments like this:
   -- Purpose: Validates employee data before insertion
   -- Triggers on: BEFORE INSERT on employees
   -- Author: Your Name
   -- Created: 2025-01-20
   -- Last Modified: 2025-01-20
   ```

2. **Test Thoroughly**

   - Test valid scenarios
   - Test invalid scenarios
   - Test edge cases
   - Test performance with large datasets

3. **Handle Errors Gracefully**

   ```sql
   -- Always provide helpful error messages
   SIGNAL SQLSTATE '45000'
   SET MESSAGE_TEXT = 'Clear, helpful error message here';
   ```

4. **Keep It Simple**

   - One trigger = one responsibility
   - Avoid complex logic in triggers
   - Use stored procedures for complex operations

5. **Monitor Performance**
   ```sql
   -- Add timing if needed
   SET @start_time = NOW(6);
   -- Your trigger logic
   SET @end_time = NOW(6);
   INSERT INTO performance_log VALUES (TIMESTAMPDIFF(MICROSECOND, @start_time, @end_time));
   ```

### **Common Pitfalls**

1. **Infinite Loops**

   ```sql
   -- BAD: This can create infinite loops
   CREATE TRIGGER bad_update_trigger
       AFTER UPDATE ON employees
       FOR EACH ROW
       UPDATE employees SET updated_at = NOW() WHERE id = NEW.id;
   -- The UPDATE will fire the trigger again!
   ```

2. **Mutating Table Errors**

   ```sql
   -- BAD: Reading from the same table being modified
   CREATE TRIGGER bad_salary_check
       BEFORE INSERT ON employees
       FOR EACH ROW
       SET NEW.rank = (SELECT COUNT(*) FROM employees WHERE salary > NEW.salary);
   -- This might cause issues in some scenarios
   ```

3. **Performance Issues**
   ```sql
   -- BAD: Slow operations in triggers
   CREATE TRIGGER performance_killer
       AFTER INSERT ON orders
       FOR EACH ROW
       -- Don't do complex calculations or external API calls here!
   ```

---

## Managing Your Triggers

### **Viewing Your Triggers**

```sql
-- See all triggers in your database
SHOW TRIGGERS;

-- Get specific trigger details
SHOW TRIGGERS LIKE 'employees';

-- See the full trigger definition
SHOW CREATE TRIGGER validate_new_employee;

-- Query information_schema for detailed info
SELECT
    TRIGGER_NAME,
    EVENT_MANIPULATION,
    EVENT_OBJECT_TABLE,
    ACTION_TIMING,
    CREATED
FROM information_schema.TRIGGERS
WHERE TRIGGER_SCHEMA = DATABASE()
ORDER BY TRIGGER_NAME;
```

### **Dropping Triggers**

```sql
-- Drop a specific trigger
DROP TRIGGER IF EXISTS validate_new_employee;

-- Drop all triggers for a table (careful!)
SELECT CONCAT('DROP TRIGGER IF EXISTS ', TRIGGER_NAME, ';')
FROM information_schema.TRIGGERS
WHERE EVENT_OBJECT_TABLE = 'employees';
```

### **Temporarily Disabling Triggers**

MySQL doesn't have built-in DISABLE/ENABLE, but here's a workaround:

```sql
-- Method 1: Use session variables
SET @triggers_disabled = 1;

-- In your trigger:
IF @triggers_disabled IS NULL THEN
    -- Trigger logic here
END IF;

-- Method 2: Rename triggers (drastic but works)
RENAME TABLE employees TO employees_temp;
-- All triggers are now "disabled" because table doesn't exist
RENAME TABLE employees_temp TO employees;
```

---

## Summary

You've learned one of the most powerful features in database management. Database triggers provide automated, database-level operations that run consistently regardless of the application.

### **Key Takeaways:**

- **Automation**: Set it once, run it forever
- **Database-Level Security**: Enforce rules regardless of application
- **Auditing**: Essential for compliance requirements
- **Performance**: Keep triggers fast and simple
- **Testing**: Cover valid scenarios, invalid scenarios, and edge cases
- **Documentation**: Document your trigger logic thoroughly

### **What's Next?**

Now that you know triggers, you might want to explore:

- **Stored Procedures** (for complex business logic)
- **Functions** (for reusable calculations)
- **Events** (for scheduled tasks)
- **Views** (especially with INSTEAD OF triggers)

### **Implementation Tips:**

1. Start small and simple
2. Always test in development first
3. Monitor performance in production
4. Document your trigger logic
5. Use version control for your database schemas
6. Consider alternatives like application-level validation when appropriate

Triggers run automatically and can affect performance, so use them judiciously.

---

### **Further Reading**

- [MySQL Trigger Documentation](https://dev.mysql.com/doc/refman/8.0/en/triggers.html)
- [PostgreSQL Trigger Guide](https://www.postgresql.org/docs/current/triggers.html)
- [SQL Server Trigger Reference](https://docs.microsoft.com/en-us/sql/t-sql/statements/create-trigger-transact-sql)

---

---

This article was written by Rejaka Abimanyu Susanto, a full-stack developer based in Yogyakarta, Indonesia. For more articles on database design and web development, visit [rejaka.id](https://rejaka.id).

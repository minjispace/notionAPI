-- Pages 테이블
CREATE TABLE Pages (
    page_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    parent_page_id INT,
    FOREIGN KEY (parent_page_id) REFERENCES Pages(page_id),
    INDEX parent_page_id_index (parent_page_id) 
);

-- Breadcrumbs 테이블
CREATE TABLE Breadcrumbs (
    breadcrumb_id INT PRIMARY KEY AUTO_INCREMENT,
    page_id INT,
    breadcrumb_text VARCHAR(255),
    FOREIGN KEY (page_id) REFERENCES Pages(page_id)
);
-- insert into pages
INSERT INTO Pages (title, content, parent_page_id) VALUES ('페이지 1', '페이지 1의 내용', NULL);
INSERT INTO Pages (title, content, parent_page_id) VALUES ('페이지 1-1', '페이지 1-1의 내용', 1);
INSERT INTO Pages (title, content, parent_page_id) VALUES ('페이지 1-1-1', '페이지 1-1-1의 내용', 2);
INSERT INTO Pages (title, content, parent_page_id) VALUES ('페이지 1-1-2', '페이지 1-1-2의 내용', 2);
INSERT INTO Pages (title, content, parent_page_id) VALUES ('페이지 1-2', '페이지 1-2의 내용', 1);
INSERT INTO Pages (title, content, parent_page_id) VALUES ('페이지 1-2-1', '페이지 1-2-1의 내용', 5);
INSERT INTO Pages (title, content, parent_page_id) VALUES ('페이지 2', '페이지 2의 내용', NULL);
INSERT INTO Pages (title, content, parent_page_id) VALUES ('페이지 2-1', '페이지 2-1의 내용', 7);
INSERT INTO Pages (title, content, parent_page_id) VALUES ('페이지 2-1-1', '페이지 2-1-1의 내용', 8);
INSERT INTO Pages (title, content, parent_page_id) VALUES ('페이지 2-1-2', '페이지 2-1-2의 내용', 8);
INSERT INTO Pages (title, content, parent_page_id) VALUES ('페이지 3', '페이지 3의 내용', NULL);
INSERT INTO Pages (title, content, parent_page_id) VALUES ('페이지 3-1', '페이지 3-1의 내용', 11);
INSERT INTO Pages (title, content, parent_page_id) VALUES ('페이지 3-1-1', '페이지 3-1-1의 내용', 12);
INSERT INTO Pages (title, content, parent_page_id) VALUES ('페이지 3-1-2', '페이지 3-1-2의 내용', 12);
INSERT INTO Pages (title, content, parent_page_id) VALUES ('페이지 3-2', '페이지 3-2의 내용', 11);
INSERT INTO Pages (title, content, parent_page_id) VALUES ('페이지 3-2-1', '페이지 3-2-1의 내용', 15);
INSERT INTO Pages (title, content, parent_page_id) VALUES ('페이지 3-2-2', '페이지 3-2-2의 내용', 15);

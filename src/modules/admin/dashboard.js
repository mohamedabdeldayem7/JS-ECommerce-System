function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  sidebar.classList.toggle("active");
  overlay.classList.toggle("active");
}

document.querySelectorAll(".sidebar .nav-link[data-target]").forEach((link) => {
  link.addEventListener("click", function (e) {
    // 1. إزالة الحالة النشطة من كل الروابط
    document
      .querySelectorAll(".sidebar .nav-link")
      .forEach((l) => l.classList.remove("active"));
    // 2. إضافة الحالة النشطة للرابط الحالي
    this.classList.add("active");

    // 3. إخفاء كل السكاشن
    document
      .querySelectorAll(".content-section")
      .forEach((section) => section.classList.add("d-none"));

    // 4. إظهار السكشن المطلوب
    const targetId = this.getAttribute("data-target");
    document.getElementById(targetId).classList.remove("d-none");

    // 5. إغلاق السايدبار إذا كنا في وضع الموبايل
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  });
});

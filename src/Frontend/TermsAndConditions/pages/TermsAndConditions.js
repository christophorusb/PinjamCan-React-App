import React from 'react'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
const TermsAndConditions = () => {
  return (
    <Container>
        <div className="mb-5">
            <h3>Syarat dan Ketentuan</h3>
        </div>
        <Container fluid="sm">
            <ol type="1" style={{fontSize: '1rem'}} className="terms-conditions-list">
                <li className="term">
                    Pengguna dengan ini menyatakan mampu untuk mengikatkan dirinya dalam sebuah perjanjian yang sah 
                    menurut hukum yang berlaku di Indonesia.
                </li>
                <li className="term">
                    Pinjamcan tidak memungut biaya pendaftaran kepada Pengguna yang ingin mendaftarkan diri.
                </li>
                <li className="term">
                    Pengguna yang ingin mendaftarkan diri wajib mengisi form pendaftaran dengan data diri yang benar 
                    dan lengkap sesuai dengan kartu identitas yang valid. Data diri Pengguna merupakan tanggung jawab Pengguna.
                </li>
                <li className="term">
                    <p>Pengguna yang ingin mendaftarkan diri wajib mengisi form pendaftaran dengan data diri yang benar dan lengkap sesuai dengan kartu identitas yang valid. Data diri Pengguna merupakan tanggung jawab Pengguna.</p>
                </li>
                <li className="term">
                    <p>
                        Pengguna yang telah terdaftar berhak bertindak sebagai:<br/>
                        <ul>
                            <li>Pemilik barang, dapat mendaftarkan barang dan membuat pesanan sewa</li>
                            <li>Penyewa, dapat melakukan penyewaan barang</li>
                        </ul>
                    </p>
                </li>
                <li className="term">
                    <p>
                        PinjamCan memiliki kewenangan untuk melakukan penyesuaian jumlah transaksi toko, 
                        reputasi, dan/atau melakukan proses moderasi/menutup akun Pengguna, jika diketahui atau diduga 
                        adanya kecurangan oleh Pengguna, yang bertujuan memanipulasi data transaksi Pengguna demi meningkatkan reputasi toko 
                        (review dan atau jumlah transaksi). Contohnya adalah melakukan proses belanja ke 
                        toko sendiri dengan menggunakan akun pribadi atau akun pribadi lainnya.
                    </p>
                </li>
                <li className="term">
                    <p>
                        PinjamCan tanpa pemberitahuan terlebih dahulu kepada Pengguna, 
                        memiliki kewenangan untuk melakukan tindakan yang dianggap perlu atas setiap dugaan pelanggaran dan/atau pelanggaran 
                        Syarat {"&"} Ketentuan dan/atau hukum yang berlaku, 
                        yaitu tindakan berupa penghapusan barang,
                        pembatalan listing, melakukan suspensi terhadap akun Pengguna, maupun menghapus akun Pengguna.
                    </p>
                </li>
                <li className="term">
                    <p>
                        PinjamCan memiliki kewenangan atas akun pengguna apabila ditemukan adanya tindakan kecurangan dalam bertransaksi untuk kepentingan 
                        pribadi pengguna maupun tidak bertanggung jawab atas kerusakan barang yang disewa kepada penyewa.
                    </p>
                </li>
                <li className="term">
                    <p>
                        PinjamCan memiliki kewenangan untuk melakukan pembekuan saldo PinjamCan Pengguna apabila ditemukan / diduga adanya tindak kecurangan dalam bertransaksi dan/atau pelanggaran terhadap syarat dan ketentuan PinjamCan.
                    </p>
                </li>
                <li>
                    <p>
                        Pengguna bertanggung jawab secara pribadi untuk menjaga kerahasiaan akun dan password untuk semua aktivitas yang terjadi dalam akun Pengguna.
                    </p>
                </li>
                <li className="term">
                    <p>
                        Pengguna dengan ini menyatakan bahwa PinjamCan tidak bertanggung jawab 
                        atas segala kerugian atau kerusakan yang timbul dari penyalahgunaan akun Pengguna.
                    </p>
                </li>
                <li className="term">
                    <p>
                        Merchant dengan ini menyatakan bahwa PinjamCan tidak bertangung jawab atas segala kerugian atau kerusakan 
                        yang timbul selama disewa oleh Penyewa.
                    </p>
                </li>
            </ol>
        </Container>
    </Container>
  )
}

export default TermsAndConditions
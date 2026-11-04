package tecnm.equipo4.barberoApi.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "cliente")
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCliente;

    @NotNull
    @NotEmpty
    @Column(name = "nombreCompleto")
    private String nombreCompleto;

    @NotNull
    @Size(min = 10, max = 12)
    @Column(name = "telefono")
    @Pattern(regexp = "^\\d{3}[-\\s]?\\d{3}[-\\s]?\\d{4}$")
    private String telefono;

    @NotNull
    @Email
    @Column(name = "email")
    private String email;

    @NotBlank
    @Column(name = "password")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$",
            message = "La contraseña debe tener: al menos una mayúscula, una minúscula, un número y un carácter especial")
    private String password;

    @NotNull
    @Column(name = "tipoUsuario")
    private String tipoUsuario;

    @Lob
    @Column(name = "foto", columnDefinition = "LONGBLOB")
    private byte[] foto;

    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL)
    private List<Turno> turnos = new ArrayList<>();

    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "cliente")
    private List<ClienteBarbero> clientesBarberos;
}
